// ChatLayout.jsx
import { useState, useEffect, useRef } from "react";
import ChatWindow from "./ChatWindow";
import { getSocket } from "../utils/socket";
import axios from "axios";
import { useRouter } from "next/router";

// Utility: get header height in px, fallback to 0
function getHeaderHeight() {
  if (typeof document !== "undefined") {
    const header =
      document.getElementById("headerr") ||
      document.querySelector(".headerr") ||
      document.getElementById("header") ||
      document.querySelector("header") ||
      null;
    if (header) {
      return header.offsetHeight || 0;
    }
  }
  return 0;
}

export default function ChatLayout({
  userId,
  chats,
  selectedChatId,
  setSelectedChatId,
  tempChat,
  setTempChat,
  reloadChats,
}) {
  const router = useRouter();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [socketReady, setSocketReady] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const sidebarRef = useRef(null);
  const [chatMessages, setChatMessages] = useState({});

  // State for dynamic max height
  const [maxContentHeight, setMaxContentHeight] = useState(
    typeof window !== "undefined"
      ? window.innerHeight - getHeaderHeight()
      : undefined
  );

  // Calculate maxContentHeight
  useEffect(() => {
    function updateMaxContentHeight() {
      const headerH = getHeaderHeight();
      setMaxContentHeight(window.innerHeight - headerH);
    }
    if (typeof window !== "undefined") {
      updateMaxContentHeight();
      window.addEventListener("resize", updateMaxContentHeight);
      let header =
        document.getElementById("headerr") ||
        document.querySelector(".headerr") ||
        document.getElementById("header") ||
        document.querySelector("header");
      let observer;
      if (window.ResizeObserver && header) {
        observer = new window.ResizeObserver(() => updateMaxContentHeight());
        observer.observe(header);
      }
      return () => {
        window.removeEventListener("resize", updateMaxContentHeight);
        if (observer && header) observer.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (!selectedChat?._id) return;

    async function load() {
      const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "";
      const res = await axios.get(`${baseUrl}/api/chats/${selectedChat._id}/messages`, {
        headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
      });
      setChatMessages(prev => ({
        ...prev,
        [selectedChat._id]: res.data.messages
      }));
    }

    load();
  }, [selectedChat?._id]);


  function getReceiver(participants, myId) {
    return participants?.find(p => (p?._id || p) !== myId) || participants?.[0] || {};
  }

  function mapChats(rawChats) {
    return (rawChats || []).map((chat) => {
      const receiver = getReceiver(chat.participants, userId);
      const serverUnread =
        typeof chat.unreadCount === "number"
          ? chat.unreadCount
          : (chat.unreadCounts && chat.unreadCounts[userId]) || chat.unseenCount || 0;

      return {
        ...chat,
        _receiver: receiver,
        storeTitle: receiver.storeTitle || receiver.email || "New Chat",
        avatarUrl: receiver.userProfile || null,
        unseenCount: Number(serverUnread) || 0,
      };
    });
  }

  function mapTempChat(rawTempChat) {
    if (!rawTempChat) return null;
    const receiver = getReceiver(rawTempChat.participants || [], userId);
    return {
      ...rawTempChat,
      _receiver: receiver,
      storeTitle: receiver.storeTitle || receiver.email || "New Chat",
      avatarUrl: receiver.userProfile || null,
      unseenCount: 0,
    };
  }

  useEffect(() => {
    setChatList(mapChats(chats));
  }, [chats, userId]);

  useEffect(() => {
    let chat = chatList.find(c => c._id === selectedChatId) || null;
    if (!chat && tempChat && tempChat._id === selectedChatId) {
      chat = mapTempChat(tempChat);
    }
    setSelectedChat(chat);
  }, [selectedChatId, chatList, tempChat, userId]);

  useEffect(() => {
    if (!sidebarRef.current) return;
    const el = sidebarRef.current.querySelector(`[data-chatid="${selectedChatId}"]`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedChatId, chatList, tempChat]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    let didJoin = false;
    function handleConnect() {
      if (userId && socket && !didJoin) {
        socket.emit("join", { userId });
        setSocketReady(true);
        didJoin = true;
      }
    }
    socket.on("connect", handleConnect);
    if (socket.connected && userId && !didJoin) handleConnect();
    return () => {
      if (socket) socket.off("connect", handleConnect);
    };
  }, [userId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !userId) return;

    const handleNewMessage = (msg) => {
      setChatList((prevList) => {
        let updated = [...prevList];
        const idx = updated.findIndex((c) => String(c._id) === String(msg.chatId));

        if (idx >= 0) {
          const existing = updated[idx];
          const serverUnread = typeof msg.unreadCount === "number" ? msg.unreadCount : null;
          let newUnseen;
          if (serverUnread !== null) {
            newUnseen = serverUnread;
          } else {
            newUnseen = (existing.unseenCount || 0) + (msg.sender !== userId ? 1 : 0);
          }

          const updatedChat = { ...existing, lastMessage: msg, unseenCount: newUnseen };
          updated.splice(idx, 1);
          return [updatedChat, ...updated];
        }

        const placeholder = {
          _id: msg.chatId,
          participants: msg.participants || [],
          _receiver: { _id: msg.sender === userId ? (msg.participants || [])[1] : msg.sender },
          storeTitle: msg.senderName || "New Chat",
          lastMessage: msg,
          unseenCount: msg.sender !== userId ? (msg.unreadCount ?? 1) : 0,
        };

        return [placeholder, ...updated];
      });

      setChatMessages((prev) => {
        const current = prev[msg.chatId] || [];

        // 1️⃣ If the sender gets their own message back: replace optimistic version
        if (msg.sender === userId) {
          const optimisticIndex = current.findIndex(m =>
            m.optimistic === true || m._id.startsWith("local-")
          );

          if (optimisticIndex !== -1) {
            const updated = [...current];
            updated[optimisticIndex] = msg; // Replace temp with real
            return { ...prev, [msg.chatId]: updated };
          }
        }

        // 2️⃣ For receiver or any new real messages — append normally
        return {
          ...prev,
          [msg.chatId]: [...current, msg],
        };
      });

      if (msg.chatId) setSelectedChatId(msg.chatId);
    };

    socket.on("new_message", handleNewMessage);
    return () => socket.off("new_message", handleNewMessage);
  }, [userId, setSelectedChatId]);

  useEffect(() => {
    if (!selectedChatId) return;
    setChatList(prev => prev.map(c => (c._id === selectedChatId ? { ...c, unseenCount: 0 } : c)));
    const socket = getSocket();
    const chat = chatList.find(c => c._id === selectedChatId);
    const lastMsg = chat?.lastMessage;
    if (socket && lastMsg && lastMsg._id && lastMsg.sender !== userId) {
      socket.emit("message_read", { messageId: lastMsg._id, userId });
      if (typeof reloadChats === "function") reloadChats();
    }
  }, [selectedChatId]);

  const handleDeleteChat = async (chatId) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "";
      await axios.delete(`${baseUrl}/api/chats/${chatId}`, {
        headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
      });
      setChatList(prev => prev.filter(c => c._id !== chatId));
      if (selectedChatId === chatId) setSelectedChatId(null);
      setMenuOpenId(null);
      setConfirmDelete(null);
    } catch (err) {
      console.error("Failed to delete chat", err);
      alert("Could not delete chat.");
    }
  };

  let sidebarChats = chatList;
  const mappedTempChat = mapTempChat(tempChat);
  if (mappedTempChat && !chatList.some(c => c._id === mappedTempChat._id)) {
    sidebarChats = [mappedTempChat, ...chatList];
  }

  // Sidebar is open by default on mobile only if no chat is selected (FIXED)
  const isWindowDefined = typeof window !== "undefined";
  // Only open sidebar at the start, if no chat is selected
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    isWindowDefined
      ? (window.matchMedia("(max-width: 639px)").matches && !selectedChatId)
      : false
  );

  // To handle first-load edge case: track initial mount for mobile, to avoid sidebar opening again when selecting chat for first time
  const firstRender = useRef(true);

  // Responsive mobile detection
  const [isMobile, setIsMobile] = useState(
    isWindowDefined ? window.matchMedia("(max-width: 639px)").matches : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 639px)");

    // Handler for media query changes
    const handler = () => {
      const mobile = mq.matches;
      setIsMobile(mobile);

      // Only auto-show sidebar when becoming mobile AND no chat is selected
      // (prevents sidebar re-opening when selecting a chat on first load)
      if (mobile && !selectedChatId) {
        setSidebarOpen(true);
      } else if (!mobile) {
        setSidebarOpen(false);
      }
    };

    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);

    handler();
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
    // Do not depend on selectedChatId to avoid sidebar "re-opening" on selecting chat after first load
    // eslint-disable-next-line
  }, []);

  // On mobile, close sidebar when selecting a chat, but do not cause it to open again on first selection/load
  useEffect(() => {
    if (!isMobile) return;
    // Prevent effect on first render (initialization)
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // If user selects a chat, close the sidebar on mobile!
    if (selectedChatId) setSidebarOpen(false);
  }, [selectedChatId, isMobile]);

  const showSidebar = isMobile ? sidebarOpen : true;

  const dynamicHeight = maxContentHeight !== undefined
    ? Math.max(0, maxContentHeight)
    : "auto";

  const sidebarZ = isMobile && sidebarOpen ? 2147483647 : (isMobile ? 50 : undefined);
  const modalZ = (isMobile && sidebarOpen) ? sidebarZ + 2 : 2147483647;

  const sidebarStyle = isMobile
    ? sidebarOpen
      ? {
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          maxHeight: "100vh",
          width: "100vw",
          maxWidth: "100vw",
          zIndex: sidebarZ,
        }
      : {
          position: "fixed",
          left: "-110vw",
          top: 0,
          height: dynamicHeight,
          width: 0,
          maxHeight: dynamicHeight,
          maxWidth: "100vw",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: sidebarZ,
        }
    : {
        width: "315px",
        maxWidth: "100vw",
        height: dynamicHeight,
        maxHeight: dynamicHeight,
      };

  const layoutHeightStyle = {
    height: dynamicHeight,
    maxHeight: dynamicHeight,
  };

  // Handler to close menu popover when clicking outside
  useEffect(() => {
    if (menuOpenId === null) return;

    function handleClick(e) {
      // If the menu is open, and click is not on a menu trigger or action, close the menu.
      // We'll mark the popover as .chatlist-popover-menu
      const popover = document.querySelector(".chatlist-popover-menu");
      if (!popover) {
        setMenuOpenId(null);
        return;
      }
      if (!popover.contains(e.target)) {
        setMenuOpenId(null);
      }
    }

    document.addEventListener("mousedown", handleClick, true);
    document.addEventListener("touchstart", handleClick, true);

    return () => {
      document.removeEventListener("mousedown", handleClick, true);
      document.removeEventListener("touchstart", handleClick, true);
    };
  }, [menuOpenId]);

  return (
    <div
      className="flex sm:flex-row flex-col w-full min-h-0 font-quicksand bg-gradient-to-tr from-[#fff6ed] to-[#f1e4d7] relative"
      style={layoutHeightStyle}
    >
      {/* Sidebar Toggle Floating Button */}
      {/* {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-3 bottom-4 z-50 bg-[#fbdbc4] border border-[#e3b79c] shadow-xl rounded-full p-[12px] flex items-center justify-center active:bg-[#ffeddb] transition sm:hidden"
          aria-label="Open chat sidebar"
        >
          <svg width={27} height={27} fill="none" stroke="#e05d3f" strokeWidth={2.5} viewBox="0 0 24 24">
            <rect width={24} height={24} fill="none"/>
            <path d="M4 7h16M4 12h16M4 17h16" strokeWidth={2.3} strokeLinecap="round"/>
          </svg>
        </button>
      )} */}

      {/* Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          style={{ zIndex: sidebarZ - 1 }}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={[
          "sm:static sm:block bg-[linear-gradient(120deg,#f9f6f2_72%,#fdf6ee_100%)] border-r-2 border-[#ecd5cd] shadow-[0_6px_16px_0_#a37b6440,0_0.5px_0_#ecd5cd] transition-all duration-300",
          isMobile ? "" : "w-[315px] max-w-full flex flex-col h-full"
        ].join(" ")}
        style={sidebarStyle}
      >
        <div className="flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 min-h-[56px] border-b-2 border-[#ecd5cd] sticky top-0 z-50 bg-[linear-gradient(90deg,#fae9db_60%,#fff6ed_120%)] select-none font-semibold text-[#be6117] text-[19px] sm:text-[21px] tracking-tight font-quicksand">
          {isMobile && (
            sidebarOpen ? (
              <button
                className="mr-2 text-[#e05d3f]"
                onClick={() => {
                  setSidebarOpen(false)
                  setSelectedChat(null)
                  setSelectedChatId(null)
                  router.push("/");
                }}
                aria-label="Close chat sidebar"
              >
                <svg width={28} height={28} fill="none" stroke="#e05d3f" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path d="M6 6L18 18M18 6L6 18" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </button>
            ) : (
              <span className="mr-2" />
            )
          )}
          <svg width={27} height={27} className="mr-2" fill="none" stroke="#e05d3f" strokeWidth={2.35} viewBox="0 0 24 24">
            <rect x="2.7" y="7" width="18.6" height="13" rx="3.7" fill="#fbdcc4" stroke="#e05d3f" strokeWidth="2.3"/>
            <path d="M2 7L11.7 13.3c.2.12.44.19.68.19.25 0 .49-.07.7-.2L22 7" stroke="#e05d3f"/>
            <circle cx="19" cy="5" r="2" fill="#e05d3f" />
          </svg>
          <h2 className="pl-1">Chats</h2>
        </div>

        <div
          ref={sidebarRef}
          className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-[#ecd5cd] scrollbar-track-[#f9f6f2] min-h-0"
          style={{
            height: dynamicHeight && isMobile
              ? `calc(${dynamicHeight}px - 56px)`
              : "auto"
          }}
        >
          {sidebarChats.length === 0 && (
            <div className="p-10 text-[#ae9681] text-center text-[15px] font-quicksand select-none opacity-75 leading-snug">
              No chats yet.<br />Start a conversation!
            </div>
          )}

          <div className="flex flex-col gap-0.5">
            {sidebarChats.map(chat => {
              const isSelected = selectedChatId === chat._id;
              const lastMsg = chat.lastMessage;
              const receiver = chat._receiver || {};

              let avatar =
                chat.avatarUrl ? (
                  <img
                    src={chat.avatarUrl}
                    alt=""
                    className="rounded-full w-[38px] h-[38px] object-cover mr-3 border border-[#ecd5cd] shadow-sm flex-shrink-0"
                  />
                ) : (
                  <div className={[
                    "w-[38px] h-[38px] mr-3 rounded-full flex items-center justify-center font-bold text-[19px] border border-[#ecd5cd] shadow-sm flex-shrink-0",
                    isSelected
                      ? "bg-[#ffdbca] text-[#da611d] shadow-[0_2.2px_14px_#ecd5cd25]"
                      : "bg-[#fcebd7] text-[#ba8b50]"
                  ].join(" ")}>
                    {receiver.storeTitle
                      ? receiver.storeTitle.trim().split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
                      : receiver.email
                        ? receiver.email.trim().split("@")[0].split(/[^\w]/).map(n => n[0]).join("").toUpperCase().slice(0,2)
                        : "🧵"}
                  </div>
                );

              const unseen = chat._id !== selectedChatId && +chat.unseenCount > 0;

              let lastTime = "";
              if (lastMsg && lastMsg.createdAt) {
                const date = new Date(lastMsg.createdAt);
                const now = new Date();
                lastTime = date.toDateString() === now.toDateString()
                  ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).replace(/^0/, "")
                  : `${date.getDate()}/${date.getMonth() + 1}`;
              }

              return (
                <div
                  key={chat._id}
                  data-chatid={chat._id}
                  onClick={() => {
                    if (selectedChatId === chat._id && isMobile) {
                      // If clicking again on already-selected chat while on mobile, close sidebar
                      setSidebarOpen(false);
                    } else {
                      setSelectedChatId(chat._id);
                    }
                  }}
                  className={[
                    "flex items-center min-h-[48px] px-4 py-2 transition-all duration-150 select-none outline-none group",
                    isSelected
                      ? "bg-[#fdf6ee] border-l-[5px] border-l-[#e05d3f] rounded-r-xl shadow-inner"
                      : "hover:bg-[#f7eee7] border-b border-[#f0e7e0]",
                    "sm:text-base text-[15px]",
                  ].join(" ")}
                >
                  {avatar}

                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={[
                        "font-semibold text-[16.3px] tracking-tight truncate max-w-[160px]",
                        isSelected ? "text-[#bf6116]" : "text-[#76432d]"
                      ].join(" ")}>
                        {receiver.userRole === "seller"
                          ? receiver.storeTitle
                          : receiver.firstName || receiver.email || "New Chat"}
                      </span>

                      {lastTime && (
                        <span className="ml-2 text-[13px] text-[#ae9681] font-mono opacity-90 whitespace-nowrap">
                          {lastTime}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 min-h-[21px]">
                      {lastMsg ? (
                        <span className="text-[#b87338] text-[14px] max-w-[136px] truncate block opacity-98 font-normal">
                          {lastMsg.text || (
                            <span className="text-[#dbb095] text-[13px]">[media]</span>
                          )}
                        </span>
                      ) : (
                        <span className="text-[#cea381] italic text-[12.9px] opacity-70">
                          No messages
                        </span>
                      )}

                      {unseen && (
                        <span className="ml-1 inline-block rounded-full bg-[#e05d3f] text-white px-[9px] py-[1.5px] text-[12.4px] font-bold font-mono shadow-[0_2px_8px_#ecd5cd22] border border-[#ecd5cd] outline outline-2 outline-[#fff8f2] outline-offset-2">
                          {chat.unseenCount}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="relative ml-2">
                    <button
                      className="p-1 hover:bg-gray-200 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === chat._id ? null : chat._id);
                      }}
                    >
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="2"/>
                        <circle cx="12" cy="12" r="2"/>
                        <circle cx="12" cy="19" r="2"/>
                      </svg>
                    </button>

                    {menuOpenId === chat._id && (
                      <div
                        className="absolute right-[23px] top-[-0.5rem] bg-white border border-gray-200 rounded-md shadow-lg z-1000 min-w-[120px] py-1 chatlist-popover-menu"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          className="block w-full px-3 py-2 text-left text-red-600 hover:bg-red-100 rounded-md"
                          onClick={() => setConfirmDelete(chat._id)}
                        >
                          Delete chat
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={[
          "flex-1 flex flex-col bg-gradient-to-tl from-[#fff7f0] to-[#fdf6ee] relative min-h-0",
          isMobile && sidebarOpen ? "overflow-hidden pointer-events-none select-none" : "flex"
        ].join(" ")}
        style={layoutHeightStyle}
      >
        {isMobile && (
          <div className="flex items-center bg-[#fff7f0] border-b border-[#ecd5cd] px-2 py-3 sm:hidden z-10 min-h-[56px]">
            <button
              onClick={() => setSidebarOpen(true)}
              className="mr-2 p-[6px] rounded-full hover:bg-[#fff3ec]"
              aria-label="Back to chat list"
            >
              <svg width={25} height={25} fill="none" stroke="#e0985f" viewBox="0 0 24 24">
                <path d="M15 6l-6 6 6 6" stroke="#e0985f" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <span className="text-[#be6117] font-semibold text-[18px]">
              {selectedChat?._receiver?.storeTitle || selectedChat?._receiver?.firstName || "Chat"}
            </span>
          </div>
        )}

        <div className="flex-1 min-h-0 flex flex-col h-full">
          {selectedChat ? (
            <ChatWindow
              chat={selectedChat}
              userId={userId}
              messages={chatMessages[selectedChatId] || []}
              setMessages={(updateFn) =>
                setChatMessages((prev) => {
                  const prevMsgs = prev[selectedChatId] || [];

                  const newMsgs =
                    typeof updateFn === "function"
                      ? updateFn(prevMsgs) // run the function!
                      : updateFn;          // direct array

                  return {
                    ...prev,
                    [selectedChatId]: newMsgs,
                  };
                })
              }
              reloadChats={reloadChats}
            />

          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#e2b691] font-semibold text-[22.8px] font-quicksand select-none opacity-80 tracking-wide animate-fadein min-h-0">
              <svg width={84} height={84} className="mb-2 opacity-85"
                fill="none" stroke="#e1b78d" strokeWidth="2.2" viewBox="0 0 41 41">
                <rect x="5" y="11" width="31" height="21" rx="4" fill="#fbe5d3" stroke="#e05d3f" />
                <path d="M5 11L20.5 22L36 11" stroke="#e1b78d" />
              </svg>
              Select a chat to start messaging.
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Popup */}
      {confirmDelete && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30"
          style={{
            zIndex: modalZ
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full text-center">
            <p className="mb-4 text-gray-800 font-semibold">Are you sure you want to delete this chat?</p>
            <div className="flex justify-around gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleDeleteChat(confirmDelete)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
