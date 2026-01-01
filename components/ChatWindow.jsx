// ChatWindow.jsx (replace existing file)
import { useState, useEffect, useRef, useCallback } from "react";
import { initSocket  } from "../utils/socket";
import axios from "axios";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import MediaViewer from "./MediaViewer";
/**
 * Ensure socket is definitely connected before use, with retry.
 * Allows actions to block until socket is ready, which can fix
 * first load issues where getSocket returns but not yet connected.
 */
async function ensureSocketConnected(socket, maxAttempts = 8, delayMs = 250) {
  let tries = 0;
  while (tries < maxAttempts) {
    if (socket?.connected) return socket;
    await new Promise(res => setTimeout(res, delayMs));
    tries++;
  }
  return socket;
}

export default function ChatWindow({ chat, userId, reloadChats, messages, setMessages }) {

  const [typingUsers, setTypingUsers] = useState([]);
  const [socketReady, setSocketReady] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(72);

  
  const [viewerMedia, setViewerMedia] = useState(null);

  const openMedia = (attachment) => setViewerMedia(attachment);
  const closeViewer = () => setViewerMedia(null);
  

  const socketRef = useRef(null);
  const sendingMessageRef = useRef(false);
  const scrollRef = useRef(null);        // Last message
  const containerRef = useRef(null);     // Scrollable container
  const initialLoadDone = useRef(false);

  const [editingMessage, setEditingMessage] = useState(null);

const handleEditCancel = () => setEditingMessage(null);

  // Fetch messages
  const fetchMessagesById = useCallback(async (chatId) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "";
      const res = await axios.get(`${baseUrl}/api/chats/${chatId}/messages`, {
        headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
      });
      setMessages(res.data.messages || []);
      sendingMessageRef.current = false;
      initialLoadDone.current = true;
    } catch (err) {
      console.error(err);
    }
  }, []);


  useEffect(() => {
    if (!userId || !chat?._id) return;
  
    let unsub = false;
  
    // Initialize socket (singleton)
    let socket = initSocket(userId);
    socketRef.current = socket;
  
    // Reconnect if disconnected
    if (!socket.connected) {
      socket.connect();
    }
  
    (async () => {
      // Wait until socket is actually connected
      socket = await ensureSocketConnected(socket);
      if (unsub || !socket?.connected) return;
  
      setSocketReady(true);
  
      // Join chat room
      socket.emit("join", { userId });
      socket.emit("join_chat", { chatId: chat._id });


          // --- Place the patch here ---
    const handleReactionAdded = (updatedMsg) => {
      console.log('updatedMsg :>> ', updatedMsg);
      setMessages(prev =>
        prev.map(msg =>
          msg._id === updatedMsg._id
            ? { ...msg, reactions: updatedMsg.reactions }
            : msg
        )
      );
    };
    // --- End patch ---
    const handleMessageEdited = (updatedMsg) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === updatedMsg._id
            ? { ...msg, text: updatedMsg.text, edited: true, optimistic: false }
            : msg
        )
      );
    };
    
    // Remove old listeners first to prevent duplicates
    
 
    
  
      // Event listeners
      const handleNewMessage = (msg) => { /* ... same as before ... */ };
      const handleTypingEvent = ({ userId: tUserId, chatId }) => { /* ... */ };
      const handleMessageDeleted = ({ messageId }) => { /* ... */ };
  
      // Remove previous listeners first to avoid duplicates
      socket.off("new_message", handleNewMessage);
      socket.off("typing", handleTypingEvent);
      // socket.off("reaction_added", handleReactionAdded);
      socket.off("message_deleted", handleMessageDeleted);
    socket.off("message_edited", handleMessageEdited);

  
      socket.on("new_message", handleNewMessage);
      socket.on("typing", handleTypingEvent);
      socket.on("reaction_added", handleReactionAdded);
      socket.on("message_deleted", handleMessageDeleted);
    socket.on("message_edited", handleMessageEdited);

  
      // Clean up on unmount
      return () => {
        unsub = true;
        socket.off("new_message", handleNewMessage);
        socket.off("typing", handleTypingEvent);
        socket.off("reaction_added", handleReactionAdded);
        socket.off("message_deleted", handleMessageDeleted);
      socket.off("message_edited", handleMessageEdited);

      };
    })();
  }, [chat._id, userId, reloadChats]);
  

  const handleEditMessage = useCallback(
    async (messageId, newText) => {
      if (!newText.trim()) return;
  
      // Optimistic update
      setMessages(prev =>
        prev.map(msg =>
          msg._id === messageId ? { ...msg, text: newText, edited: true, optimistic: true } : msg
        )
      );
  
      setEditingMessage(null);
  
      let socket = socketRef.current;
      socket = await ensureSocketConnected(socket);
      if (!socket?.connected) {
        console.error("Socket not connected, cannot edit message");
        return;
      }
  
      socket.emit("edit_message", { messageId, text: newText }, (response) => {
        if (!response || response.status !== "ok") {
          // Revert on failure
          console.error("Failed to edit message:", response?.error);
          fetchMessagesById(chat._id); // refetch messages from server
        } else {
          // Update local message with server-verified data
          setMessages(prev =>
            prev.map(msg =>
              msg._id === messageId ? { ...msg, ...response.message, optimistic: false } : msg
            )
          );
        }
      });
    },
    [chat._id, fetchMessagesById]
  );
  

  // Send message (optimistic) - retry for socket connection if not yet ready
  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim()) return;

      // Wait for socket to actually be connected
      let socket = socketRef.current;
      socket = await ensureSocketConnected(socket);
      if (!socket?.connected) return;

      const tempId = `local-${Date.now()}`;
      const optimisticMessage = {
        _id: tempId,
        chatId: chat._id,
        sender: userId,
        text,
        createdAt: new Date().toISOString(),
        readBy: [userId],
        reactions: [],
        optimistic: true,
        failed: false,
      };

      setMessages(prev => [...prev, optimisticMessage]);
      sendingMessageRef.current = true;

      socket.emit(
        "send_message",
        {
          chatId: chat._id,
          senderId: userId,
          text,
          participants: chat.participants.map(p => {
            if (typeof p === "string") return String(p);
            else if (typeof p === "object" && p?._id) return p._id;
            return p;
          }),
        },
        (response) => {
          if (!response) return;
          if (response.status === "ok") {
            setMessages((prev) =>
              prev.map((m) => (m._id === tempId ? response.message : m))
            );
            console.log('chat :>> ', chat);
            if(chat?._id?.startsWith("temp")){
              // reload chats to get updated unreadCounts if needed
              reloadChats?.();
            }
          } else {
            setMessages((prev) => prev.map(m => m._id === tempId ? { ...m, failed: true, optimistic:false, error: response.error } : m));
          }
        }
      );
    },
    [userId, chat._id, chat.participants, reloadChats]
  );

  const sendAttachment = useCallback(
    async (file, onProgress) => {
      const form = new FormData();
      form.append("file", file);
  
      const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "";
  
      const res = await axios.post(`${baseUrl}/api/chats/upload`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        onUploadProgress: (progressEvent) => {
          if (!onProgress) return;
          const percent = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          onProgress(percent);
        },
      });
  
      const attachment = res.data;
  
      const tempId = "local-file-" + Date.now();
  
      const optimisticMsg = {
        _id: tempId,
        chatId: chat._id,
        sender: userId,
        text: "",
        attachments: [attachment],
        createdAt: new Date().toISOString(),
        readBy: [userId],
        optimistic: true,
      };
  
      setMessages((prev) => [...prev, optimisticMsg]);
  
      let socket = socketRef.current;
      socket = await ensureSocketConnected(socket);
  
      socket.emit(
        "send_message",
        {
          chatId: chat._id,
          senderId: userId,
          text: "",
          attachments: [attachment],
          participants: chat.participants.map((p) =>
            typeof p === "string" ? p : p._id
          ),
        },
        (response) => {
          if (response?.status === "ok") {
            setMessages((prev) =>
              prev.map((m) => (m._id === tempId ? response.message : m))
            );
          }
        }
      );
    },
    [chat._id, chat.participants, userId]
  );
  
  

  const handleTyping = useCallback(async () => {
    let socket = socketRef.current;
    socket = await ensureSocketConnected(socket);
    if (socket?.connected)
      socket.emit("typing", { chatId: chat._id, userId });
  }, [chat._id, userId]);

  const handleReaction = useCallback(
    async (messageId, type) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg._id !== messageId) return msg;

          const reactions = msg.reactions ? [...msg.reactions] : [];
          const existingIndex = reactions.findIndex(
            (r) => String(r.user) === String(userId) && r.type === type
          );

          if (existingIndex > -1) {
            reactions.splice(existingIndex, 1); // Remove reaction
          } else {
            const filtered = reactions.filter((r) => String(r.user) !== String(userId));
            filtered.push({ user: userId, type });
            return { ...msg, reactions: filtered };
          }

          return { ...msg, reactions };
        })
      );

      let socket = socketRef.current;
      socket = await ensureSocketConnected(socket);
      if (socket?.connected)
        socket.emit("add_reaction", { messageId, userId, type });
    },
    [userId]
  );

  const handleDelete = useCallback(async (messageId) => {
    setMessages((prev) =>
      prev.map((msg) => (msg._id === messageId ? { ...msg, isDeleted: true } : msg))
    );
    let socket = socketRef.current;
    socket = await ensureSocketConnected(socket);
    if (socket?.connected)
      socket.emit("delete_message", { messageId });
  }, []);

  const handleMarkRead = useCallback(
    async (msg) => {
      if (msg.sender !== userId) {
        let socket = socketRef.current;
        socket = await ensureSocketConnected(socket);
        if (socket?.connected)
          socket.emit("message_read", {
            messageId: msg._id,
            userId,
            chatId: chat._id,  // <-- FIXED
          });
      }
    },
    [userId, chat._id]
  );
  

  // Dynamic header height
  useEffect(() => {
    function updateHeaderHeight() {
      const header = document.querySelector(".headerr, header, .sticky.top-0");
      setHeaderHeight(header?.getBoundingClientRect().height || 72);
    }
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, [chat?._id]);
  
  
  useEffect(() => {
    const container = containerRef.current;
    const lastMessage = scrollRef.current;
    if (!container || !lastMessage) return;
  
    // Use requestAnimationFrame to ensure DOM is painted
    requestAnimationFrame(() => {
      lastMessage.scrollIntoView({ behavior: "smooth", block: "end" });
    });
  }, [messages]);
  
  

  // On initial messages load: mark chat as read by emitting message_read for last unread message
  // useEffect(() => {
  //   if (!initialLoadDone.current || !messages.length) return;

  //   // find last message that isn't authored by me and that I haven't read
  //   const lastUnread = [...messages].reverse().find(m => String(m.sender) !== String(userId) && !(m.readBy || []).some(r => String(r) === String(userId)));

  //   (async () => {
  //     if (lastUnread && socketRef.current) {
  //       let socket = socketRef.current;
  //       socket = await ensureSocketConnected(socket);
  //       if (socket?.connected) {
  //         socket.emit("message_read", { messageId: lastUnread._id, userId, chatId: chat._id });

  //         // Optimistically mark messages as read locally so UI updates immediately
  //         setMessages(prev => prev.map(m => ({
  //           ...m,
  //           readBy: m.readBy && m.readBy.some(r => String(r) === String(userId)) ? m.readBy : [...(m.readBy || []), userId],
  //         })));
  //         // refresh chats to update unreadCounts
  //         reloadChats?.();
  //       }
  //     }
  //   })();
  // }, [messages, userId, reloadChats]);

  // fix: make input always visible in mobile view
  // Get whether we're in mobile view so we can avoid 100vh cutting off input
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    // match max-width: 639px for mobile
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(max-width: 639px)");
      const update = () => setIsMobile(mq.matches);
      mq.addEventListener
        ? mq.addEventListener("change", update)
        : mq.addListener(update);
      update();
      return () =>
        mq.removeEventListener
          ? mq.removeEventListener("change", update)
          : mq.removeListener(update);
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        // On mobile, use height: 100dvh to include virtual keyboard, else fallback to viewport strategy
        height: isMobile ? '100dvh' : `calc(100vh - ${headerHeight}px)`,
        maxHeight: isMobile ? '100dvh' : `calc(100vh - ${headerHeight}px)`,        
        overflow: "hidden",
      }}
    >
      {/* Scrollable messages */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          // resize issues on mobile when keyboard up: add padding-bottom for ChatInput height
          // paddingBottom: isMobile ? 80 : 0,
          paddingBottom: 0,
        }}
      >
        <MessageList
          messages={messages}
          userId={userId}
          typingUsers={typingUsers}
          handleReaction={handleReaction}
          handleMarkRead={handleMarkRead}
          handleDelete={handleDelete}
          scrollRef={scrollRef} // Last message ref
          containerRef={containerRef}
          onOpenMedia={openMedia}
          onEditMessage={setEditingMessage} // <-- Add this
        />
      </div>

      {/* Sticky input */}
      <div
        style={{
          // position: isMobile ? "sticky" : "sticky",
          position: "sticky",
          bottom: 0,
          left: 0,
          width: "100%",
          background: "#F6F2EF",
          zIndex: 50,
          boxShadow: "0 -2px 10px rgba(0,0,0,0.04)",
        }}
      >
      <ChatInput
      onSend={sendMessage}
      onTyping={handleTyping}
      onSendAttachment={sendAttachment}
      editMessage={editingMessage}
      onEditCancel={handleEditCancel}
      onEdit={handleEditMessage}
    />

      </div>
      {viewerMedia && <MediaViewer media={viewerMedia} onClose={closeViewer} />}
    </div>
  );
}
