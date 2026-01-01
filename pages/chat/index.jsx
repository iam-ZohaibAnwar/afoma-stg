import ChatLayout from "../../components/ChatLayout";
import { useEffect, useState, useCallback } from "react";
import { subscribePush } from "../../utils/push";
import axios from "axios";
import { useRouter } from "next/router";
import { initSocket } from "../../utils/socket";
import Header from "../../components/Header";

const ChatPage = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [chats, setChats] = useState([]);
  const [tempChat, setTempChat] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [pendingReceiverId, setPendingReceiverId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore temp chat from sessionStorage
  // useEffect(() => {
  //   if (typeof window === "undefined") return;
  //   const stored = sessionStorage.getItem("tempChat");
  //   if (stored) {
  //     try {
  //       const parsed = JSON.parse(stored);
  //       setTempChat(parsed);
  //       setSelectedChatId(parsed._id);
  //       setPendingReceiverId(parsed.receiverId || null);
  //     } catch {
  //       sessionStorage.removeItem("tempChat");
  //     }
  //   }
  // }, []);

  // Load user and subscribe push
  useEffect(() => {
    if (typeof window === "undefined") return;
    const userStr = localStorage.getItem("user");
    if (!userStr) return setError("User not logged in");
    const user = JSON.parse(userStr);
    console.log(user)
    if (user.userRole == "seller" || user.sellerId) {
      if (!user?.userId) return setError("Could not find user ID");
      setUserId(user.userId);
      subscribePush(user.userId, "device-1");
    } else {
      if (!user?._id) return setError("Could not find user ID");
      setUserId(user._id);
      subscribePush(user._id, "device-1");
    }
  }, []);

  // Init socket once userId is available
  useEffect(() => {
    if (!userId) return;
    const socket = initSocket(userId);
    return () => {
      if (socket) socket.disconnect();
    };
  }, [userId]);

  // Read receiverId from query
  useEffect(() => {
    if (!userId) return;

    let receiverId = null;

    if (router.query?.receiverId) {
      receiverId = router.query.receiverId;
    } else if (
      typeof window !== "undefined" &&
      window.history?.state?.options?.state?.receiverId
    ) {
      receiverId = window.history.state.options.state.receiverId;
    }

    console.log('receiverId :>> ', receiverId);

    if (receiverId && receiverId !== userId) setPendingReceiverId(receiverId);
  }, [router.query, userId]);

  // Fetch chats function
  const fetchChats = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "";
      const res = await axios.get(`${baseUrl}/api/chats/${userId}`, {
        headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
      });

      const loadedChats = Array.isArray(res.data.chats) ? res.data.chats : [];
      setChats(loadedChats);

      // If we have a pending receiverId, check if a chat already exists with that receiverId in participants (by _id)
      if (pendingReceiverId) {
        // Make sure we compare all as strings for robustness
        const receiverIdString = String(pendingReceiverId);
        const userIdString = String(userId);
        console.log('receiverIdString :>> ', receiverIdString,userIdString);
        console.log('loadedChats :>> ', loadedChats);
        const foundChat = loadedChats.find(
          c =>
            Array.isArray(c.participants) &&
            c.participants.some(p => {
              console.log('p :>> ', p);
              if (typeof p === "string") return String(p) === userIdString;
              if (typeof p === "object" && p?._id) return p._id === userIdString;
              return false;
            }) &&
            c.participants.some(p => {
              if (typeof p === "string") return String(p) === receiverIdString;
              if (typeof p === "object" && p?._id) return p._id === receiverIdString;
              return false;
            })
        );
        console.log('foundChat :>> ', foundChat);
        if (foundChat) {
          // Chat already exists, just select that one
          setTempChat(null);
          setSelectedChatId(foundChat._id);
          sessionStorage.removeItem("tempChat");
        } else {
          // No chat exists, create temp chat (only if not exists)
          const temp = {
            _id: `temp-${userId}-${pendingReceiverId}`,
            participants: [
              typeof userId === "string" ? userId : String(userId),
              typeof pendingReceiverId === "string" ? pendingReceiverId : String(pendingReceiverId)
            ],
            participantsName: "New Conversation",
            lastMessage: { text: "Start the conversation..." },
            receiverId: pendingReceiverId,
            currentUserId: userId,
            isTemp: true,
          };
          setTempChat(temp);
          setSelectedChatId(temp._id);
          // Save tempChat to sessionStorage with expiry time of 1 hour
          const tempWithExpiry = {
            ...temp,
            _expiry: Date.now() + 60 * 60 * 1000 // expires in 1 hour
          };
          sessionStorage.setItem("tempChat", JSON.stringify(tempWithExpiry));
        }
      }

      setLoading(false);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Failed to fetch chats. Please try again."
      );
      setLoading(false);
    }
  }, [userId, pendingReceiverId]);

  // Initial fetch
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Display chats including temp chat if needed
  const displayChats = tempChat && !chats.some(c => c._id === tempChat._id)
    ? [tempChat, ...chats]
    : chats;

  // Enhanced UI for loading, error, and empty state
  const renderStatus = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[55vh] py-20">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-10 h-10 mr-2 text-[#C19370] animate-spin fill-[#d1b28f]"
              viewBox="0 0 100 101"
              fill="none"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#f3f3f3"
                strokeWidth="10"
                fill="none"
              />
              <path
                d="M94.5 50a44.5 44.5 0 1 1-89 0"
                fill="#e3c9b3"
              />
            </svg>
          </div>
          <div className="text-lg mt-4 text-[#8c8b88] font-semibold">Loading chats...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[55vh] py-20">
          <svg
            className="w-10 h-10 text-red-400 mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#fff" />
            <path stroke="red" strokeWidth="2" d="M15 9l-6 6m0-6l6 6" strokeLinecap="round"/>
          </svg>
          <p className="text-red-600 font-medium text-lg mb-1">There was a problem loading chats.</p>
          <p className="text-gray-500 mb-3">{error}</p>
          <button
            type="button"
            onClick={fetchChats}
            className="bg-[#C19370] hover:bg-[#ad7d4c] text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!displayChats.length) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[55vh] py-20">
          <svg
            className="w-10 h-10 text-[#C19370] opacity-70 mb-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              d="M21 20v-7M21 20l-5-5M21 20l5-5"
              stroke="#D0B399"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="#C19370" strokeWidth="1.5" />
          </svg>
          <div className="text-[#bcae9e] font-medium text-lg">
            No chats yet
          </div>
          <div className="text-[14px] text-[#ac9e8d]">Start a conversation and it will appear here.</div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen min-w-full w-screen h-screen flex flex-col bg-[#F6F2EF] overflow-hidden">
      {/* Custom header at top */}
      <div className="sticky top-0 z-30">
        <Header />
      </div>

      <main className="flex-1 flex flex-col mx-auto w-full h-full">
        {loading || error || !displayChats.length ? (
          renderStatus()
        ) : (
          <ChatLayout
            userId={userId}
            chats={displayChats}
            selectedChatId={selectedChatId}
            setSelectedChatId={setSelectedChatId}
            tempChat={tempChat}
            setTempChat={setTempChat}
            reloadChats={fetchChats}
          />
        )}
      </main>
    </div>
  );
};

export default ChatPage;
