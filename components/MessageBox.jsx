import { useState, useRef, useEffect, useMemo, memo } from "react";

// Utility for time formatting
function formatTimeWithDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  const options = { hour: "2-digit", minute: "2-digit" };
  const timeStr = date.toLocaleTimeString([], options);
  if (isToday) {
    return timeStr;
  } else {
    const day = date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return `${day} ${timeStr}`;
  }
}

// Status logic
function getDeliveryStatus(msg, chatParticipants, userId) {
  const otherParticipantIds = Array.isArray(chatParticipants)
    ? chatParticipants.filter((id) => id !== userId)
    : [];
  if (!otherParticipantIds.length) return null;
  const allRead = otherParticipantIds.every((id) =>
    msg.readBy?.includes(id)
  );
  const allDelivered = otherParticipantIds.every(
    (id) => msg.deliveredTo?.includes?.(id) || msg.readBy?.includes?.(id)
  );
  if (allRead) return { text: "Read", color: "#41b37e" };
  if (allDelivered) return { text: "Delivered", color: "#888" };
  return { text: "Sent", color: "#aaa" };
}

const REACTIONS = [
  { type: "❤️", label: "Love", color: "#FDE2EC" },
  { type: "😂", label: "Haha", color: "#FFF4C6" },
  { type: "😮", label: "Wow", color: "#FAF8F3" },
  { type: "😢", label: "Sad", color: "#EBF4FC" },
  { type: "😡", label: "Angry", color: "#FFE8E5" },
  { type: "👍", label: "Like", color: "#D7F2ED" },
];

// Helper to get element's bottom position relative to window
function getElementBottom(el) {
  if (!el) return 0;
  const rect = el.getBoundingClientRect();
  return rect.bottom;
}

export const MessageBox = memo(function MessageBox({
  msg,
  isMine,
  userId,
  handleReaction,
  handleMarkRead,
  scrollRef,
  chatParticipants = [],
  onDelete,
  onDetails,
  onOpenMedia,
  onEditMessage
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [msgTextHovered, setMsgTextHovered] = useState(false);
  const dropdownRef = useRef();
  const dotsButtonRef = useRef();
  const hoverDelay = 200;
  let hoverTimeout = null;

  // Visibility detection
  const messageRef = useRef(null);
  const [wasMarkedRead, setWasMarkedRead] = useState(false);

  // For dropdown direction and position
  const [dropdownDirection, setDropdownDirection] = useState("down");
  const [dropdownOffset, setDropdownOffset] = useState(0);

  // When opening the menu, check if there's enough space below, else open upward
  useEffect(() => {
    if (dropdownOpen) {
      // Estimate menu height and some margin. You can tweak this as needed.
      const menuHeight = dropdownRef.current?.offsetHeight ?? 154;
      if (dotsButtonRef.current && dropdownRef.current) {
        const buttonRect = dotsButtonRef.current.getBoundingClientRect();
        const msgRect = messageRef.current?.getBoundingClientRect?.();
        const dropdownRect = dropdownRef.current?.getBoundingClientRect?.();
        const viewportHeight = window.innerHeight;

        // Calculate if dropdown will overflow outside message bubble
        // and if it will go outside viewport
        if (buttonRect.bottom + menuHeight > viewportHeight - 8) {
          setDropdownDirection("up");
          // try to add extra offset if dropdown would overflow
          let overflow = buttonRect.bottom + menuHeight - viewportHeight + 8;
          setDropdownOffset(overflow > 0 ? overflow : 0);
        } else {
          // check if dropdown will overflow bottom of the parent bubble (which may be overlapped by next bubble)
          if (
            msgRect &&
            buttonRect.bottom + menuHeight > msgRect.bottom + 4
          ) {
            // open up if will overflow next message
            setDropdownDirection("up");
            setDropdownOffset(0);
          } else {
            setDropdownDirection("down");
            setDropdownOffset(0);
          }
        }
      }
    }
  }, [dropdownOpen]);

  useEffect(() => {
    // Use IntersectionObserver to call handleMarkRead when message becomes visible
    if (msg.isDeleted) return;

    let called = false;

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4 && !called) {
            called = true;
            setWasMarkedRead(true);
            handleMarkRead(msg);
            observer.disconnect();
          }
        });
      },
      { threshold: [0.2, 0.4, 0.6, 0.8, 1] }
    );

    observer.observe(messageRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line
  }, [isMine, handleMarkRead, wasMarkedRead, msg]);

  const openDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(true);
  };
  const closeDropdown = () => setDropdownOpen(false);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const handleDelete = () => {
    setDropdownOpen(false);
    if (onDelete) onDelete(msg._id, msg);
  };
  const handleDetails = () => {
    setDropdownOpen(false);
    if (onDetails) onDetails(msg);
  };

  const groupReactions = (message) => {
    if (!message.reactions?.length) return {};
    return message.reactions.reduce((acc, r) => {
      acc[r.type] = acc[r.type] || [];
      acc[r.type].push(r.user);
      return acc;
    }, {});
  };

  const grouped = useMemo(() => groupReactions(msg), [msg.reactions]);

  const deliveryStatus = isMine
    ? getDeliveryStatus(msg, chatParticipants, userId)
    : null;
  const timeStr = formatTimeWithDate(msg.createdAt);

  function getReactionBadgeClasses(isYours) {
    return [
      "flex items-center rounded-full px-2 py-0.5 min-w-[2rem] text-base font-medium gap-1",
      isYours ? "border-2 border-[#E05D3F] font-bold shadow-md" : "border border-[#e3c9b7]",
    ].join(" ");
  }

  const ReactionsRow = memo(function ReactionsRow({ grouped, isMine, userId }) {
    const containerRef = useRef(null);
    const [offset, setOffset] = useState(0);
  
    useEffect(() => {
      if (!containerRef.current) return;
      const observer = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const width = entry.contentRect.width + 12;
          setOffset(prev => (prev !== width ? width : prev));
        }
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, []);
  
    if (!grouped || Object.keys(grouped).length === 0) return null;
  
    return (
      <div
        ref={containerRef}
        className="absolute top-1/2 -translate-y-1/2 flex flex-row gap-2"
        style={{
          left: isMine ? `-${offset}px` : undefined,
          right: !isMine ? `-${offset}px` : undefined,
        }}
      >
        {Object.entries(grouped).map(([type, users]) => {
          const r = REACTIONS.find((rr) => rr.type === type);
          const isYourReaction = users.includes(userId);
          return (
            <div
              key={type}
              className={getReactionBadgeClasses(isYourReaction)}
              style={{
                background: r?.color || "#F2F1F0",
                color: "#C7522B",
                fontWeight: isYourReaction ? 700 : 400,
                boxShadow: isYourReaction ? "0 2px 7px #e05d3f21" : undefined,
                fontSize: 16,
                whiteSpace: "nowrap",
              }}
            >
              <span className="text-lg">{type}</span>
              <span className="ml-1 text-xs font-bold">{users.length}</span>
            </div>
          );
        })}
      </div>
    );
  });
  

  // --- Responsive width logic using new values ---
  const [widths, setWidths] = useState({
    bubbleMax: "80vw",
    textMax: "82vw",
    reactionsMax: "78vw"
  });

  useEffect(() => {
    function setByWindowWidth() {
      if (typeof window === "undefined") return;
      const w = window.innerWidth;
      if (w < 650) {
        setWidths({
          bubbleMax: "75vw",
          textMax: "82vw",
          reactionsMax: "78vw",
        });
      } else if (w < 900) {
        setWidths({
          bubbleMax: "45vw",
          textMax: "70vw",
          reactionsMax: "65vw",
        });
      } else if (w < 1280) {
        setWidths({
          bubbleMax: "70vw",
          textMax: "54vw",
          reactionsMax: "50vw",
        });
      } else {
        setWidths({
          bubbleMax: "45vw",
          textMax: "34vw",
          reactionsMax: "34vw",
        });
      }
    }
    setByWindowWidth();
    window.addEventListener("resize", setByWindowWidth);
    return () => window.removeEventListener("resize", setByWindowWidth);
  }, []);
  // --- End responsive logic ---

  return (
    <div
      ref={el => {
        if (scrollRef && el) scrollRef.current = el;
        messageRef.current = el;
      }}
      className={`flex flex-col relative mb-3 w-full ${isMine ? "items-end" : "items-start"}`}
      style={{ maxWidth: "100%" }}
    >
      <div
        className={`flex relative w-auto ${isMine ? "justify-end" : "justify-start"} items-end`}
        style={{ width: "100%" }}
      >
        <div className="flex flex-row items-end">
          <div
            className={`
              flex flex-col rounded-[13px] relative mb-0.5
              ${isMine ? "bg-[#FFEDE2]" : "bg-white"}
              ${msg.isDeleted ? "text-gray-400 opacity-70" : "text-[#333]"}
              border ${msg.failed ? "border-[#e24a3b]" : "border-[#ECE3DC]"}
              px-2 sm:px-4 md:px-[18px] py-1 sm:py-2 md:py-[8px] text-[15px] sm:text-[15.5px] md:text-[16.2px] leading-[1.44] break-words z-[21]
              min-w-[30px] sm:min-w-[38px]
              box-border
            `}
            style={{
              wordBreak: "break-word",
              maxWidth: widths.bubbleMax,
              transition: "max-width 0.2s cubic-bezier(.4,0,.2,1)",
              zIndex: 21,
            }}
          >
            {/* Three dots menu */}
            <div
              className={`flex ${isMine ? "justify-end" : "justify-start"} w-full items-center mb-0.5 mt-0.5 min-h-[21px] relative`}
            >
              <span className="relative h-[23px] flex items-center">
                <button
                  ref={dotsButtonRef}
                  onClick={openDropdown}
                  className="bg-transparent border-none px-1.5 cursor-pointer rounded text-[19px] text-[#b98e6d] flex items-center opacity-95 hover:bg-[#fde5d9]"
                  disabled={msg.isDeleted}
                  style={{ position: "relative", zIndex: 40 }}
                >
                  <span className="font-extrabold text-[21px] align-middle tracking-wider">⋯</span>
                </button>
                {dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className={`z-[99] flex flex-col min-w-[102px] sm:min-w-[115px] bg-white border border-[#ecd5cd] rounded-lg shadow-xl ${
                      isMine ? "right-0" : "left-0"
                    }`}
                    style={{
                      position: "absolute",
                      top:
                        dropdownDirection === "down"
                          ? "27px"
                          : undefined,
                      bottom:
                        dropdownDirection === "up"
                          ? `calc(100% + 6px + ${dropdownOffset}px)`
                          : undefined,
                      // Above all message bubbles:
                      zIndex: 9999,
                      maxHeight: "max-content",
                      overflowY: "visible",
                      boxShadow: "0 5px 24px 8px #e1d2c8d9, 0 1.5px 8px 0 #e1d2c891",
                      // A touch of outline to float above across borders
                    }}
                  >
                    {!msg.isDeleted && isMine && (
                      <button
                        className="bg-inherit border-none text-left text-[#8c674c] font-medium cursor-pointer px-5 py-2.5 hover:bg-[#f5edea]"
                        onClick={() => onEditMessage(msg)}
                      >
                        Edit
                      </button>
                    )}

                    {!msg.isDeleted && (
                      <button
                        className="bg-inherit border-none text-left text-[#d92732] font-semibold cursor-pointer px-5 py-2.5 border-b border-[#f2ccc2] hover:bg-[#fbeceb]"
                        onClick={handleDelete}
                      >
                        Delete
                      </button>
                    )}
                    <button
                      className="bg-inherit border-none text-left text-[#8c674c] font-medium cursor-pointer px-5 py-2.5 hover:bg-[#f5edea]"
                      onClick={handleDetails}
                    >
                      Details
                    </button>
                  </div>
                )}
              </span>
            </div>

            {/* Message Text + Hover reactions */}
            <div
              className={`
                relative min-h-[18px] mb-0
                min-w-[75px]
                box-border
              `}
              style={{
                maxWidth: widths.textMax,
                overflowWrap: "break-word",
                wordBreak: "break-word"
              }}
              onMouseEnter={() => {
                clearTimeout(hoverTimeout);
                setMsgTextHovered(true);
              }}
              onMouseLeave={() => {
                hoverTimeout = setTimeout(() => setMsgTextHovered(false), 200);
              }}
            >
              <span>
                {msg.isDeleted ? (
                  <span className="italic text-[#a87e5a]">This message was deleted.</span>
                ) : (
                  <>
                  {msg.attachments?.length > 0 && (
                    <div style={{ marginBottom: msg.text ? 8 : 0 }}>
                      {msg.attachments.map((a) => {
                        const isImage = a.fileType?.startsWith("image/");
                        const isVideo = a.fileType?.startsWith("video/");

                        return (
                          <div key={a.url} style={{ marginBottom: 6 }}>
                            {(isImage || isVideo) ? (
                              <img
                                src={isImage ? a.url : "/video-thumbnail.png"} 
                                onClick={() => onOpenMedia(a)}
                                style={{
                                  width: 180,
                                  borderRadius: 12,
                                  cursor: "pointer",
                                  border: "1px solid #ddd",
                                }}
                              />
                            ) : (
                              <a
                                href={a.url}
                                target="_blank"
                                style={{ color: "#E05D3F", textDecoration: "underline" }}
                              >
                                📄 {a.fileName}
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {msg.text && (
                    <span>
                      {msg.text.split(/(\s+)/).map((part, i) => {
                        // Simple URL regex: match http(s):// or www.
                        const urlRegex = /((https?:\/\/[^\s]+)|(www\.[^\s]+))/gi;
                        if (urlRegex.test(part)) {
                          // If missing http(s), add it to ensure it works in href
                          let href = part.startsWith("http") ? part : `https://${part}`;
                          return (
                            <a
                              key={i}
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#E05D3F", textDecoration: "underline", wordBreak: "break-all" }}
                            >
                              {part}
                            </a>
                          );
                        }
                        return <span key={i}>{part}</span>;
                      })}
                    </span>
                  )}
                  {msg.edited && !msg.isDeleted && (
                    <span style={{ fontSize: 12, color: "#888", marginLeft: 4 }}>(edited)</span>
                  )}

                  </>
                )}
              </span>
              {/* Reaction popover */}
              {!msg.isDeleted && msgTextHovered && (
                <div
                  className="absolute mt-1 flex flex-row gap-1 z-50 bg-white rounded-[22px] border border-[#ECD5CD] px-2 py-1 shadow-lg"
                  style={{
                    width: "max-content",
                    minWidth: "max-content",
                    maxWidth: widths.reactionsMax,
                    right: isMine ? 0 : "auto",
                    left: !isMine ? 0 : "auto",
                  }}
                  onMouseEnter={() => clearTimeout(hoverTimeout)}
                  onMouseLeave={() => {
                    hoverTimeout = setTimeout(() => setMsgTextHovered(false), 200);
                  }}
                >
                  {REACTIONS.map((r) => (
                    <button
                      key={r.type}
                      className="mx-0.5 rounded-[11px] text-[20px] sm:text-[23px] outline-none transition-all border-2"
                      style={{ background: r.color }}
                      onClick={e => {
                        e.stopPropagation();
                        handleReaction(msg._id, r.type);
                      }}
                      title={r.label}
                      aria-label={r.label}
                    >
                      {r.type}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Side reactions */}
            <ReactionsRow grouped={grouped} isMine={isMine} userId={userId} />

          </div>

          {/* Retry Button if failed (rendered outside bubble) */}
          {!msg.isDeleted && msg.failed && (
            <button
              className="ml-2 mb-1 flex items-center justify-center w-[28px] h-[28px] sm:w-[34px] sm:h-[34px] rounded-full bg-[#fbe9e6] border border-[#e05d3f] text-[#e05d3f] hover:bg-[#f6cfc8] transition"
              title="Retry sending"
              onClick={() => {
                if (typeof handleRetry === "function") handleRetry(msg);
              }}
              aria-label="Retry"
              type="button"
            >
              {/* Retry SVG icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.75 12A7.25 7.25 0 1012 4.75m-7 4.5V4.5a.5.5 0 01.5-.5h4.75"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Time and status */}
      <div
        className={`flex items-center flex-row gap-2 sm:gap-3 mt-1 ${isMine ? "justify-end" : "justify-start"}`}
        style={{ width: "100%" }}
      >
        <span className="text-[11.3px] sm:text-[12.5px] text-[#bcae9e] font-mono text-left tracking-[.01em] min-h-[19px]">
          {timeStr}
        </span>
        {deliveryStatus && (
          <span className="text-[11.7px] sm:text-[12.7px] min-w-[42px] sm:min-w-[54px]" style={{ color: deliveryStatus.color }}>
            {deliveryStatus.text}
          </span>
        )}
      </div>
    </div>
  );
})
