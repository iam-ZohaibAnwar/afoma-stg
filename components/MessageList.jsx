import React, { useEffect, useRef } from "react";
import { MessageBox } from "./MessageBox";

export const MessageList = React.memo(
  ({
    messages,
    userId,
    typingUsers,
    handleReaction,
    handleMarkRead,
    handleDelete,
    scrollRef,
    containerRef,
    onOpenMedia,
    onEditMessage
  }) => {
    const initialLoadDone = useRef(false);

    // useEffect(() => {
    //   if (!scrollRef?.current || !containerRef?.current) return;
    //   const container = containerRef.current;
    //   const lastMessageEl = scrollRef.current;

    //   const distanceFromBottom =
    //     container.scrollHeight - container.scrollTop - container.clientHeight;
    //   const isNearBottom = distanceFromBottom < 150; // threshold

    //   // First load: jump straight to bottom
    //   if (!initialLoadDone.current) {
    //     lastMessageEl.scrollIntoView({ behavior: "auto", block: "end" });
    //     initialLoadDone.current = true;
    //     return;
    //   }

    //   // Only scroll if user is near bottom OR the last message is theirs
    //   const lastMsg = messages[messages.length - 1];
    //   if (isNearBottom || lastMsg?.sender === userId) {
    //     const lastMsgHeight = lastMessageEl.offsetHeight + 18; // include gap
    //     container.scrollBy({ top: lastMsgHeight, behavior: "smooth" });
    //   }
    //   // Otherwise, do nothing — user is reading older messages
    // }, [messages, scrollRef, containerRef, userId]);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
          padding: 8,
        }}
      >
        {messages.map((msg, idx) => (
          <MessageBox
            key={msg._id}
            msg={msg}
            isMine={msg.sender === userId}
            userId={userId}
            handleReaction={handleReaction}
            handleMarkRead={handleMarkRead}
            onDelete={handleDelete}
            scrollRef={idx === messages.length - 1 ? scrollRef : null}
            onOpenMedia={onOpenMedia}
            onEditMessage={onEditMessage}
          />
        ))}

        {typingUsers.length > 0 && (
          <div style={{ color: "#E05D3F", fontStyle: "italic" }}>
            {typingUsers.length === 1
              ? "Someone is typing…"
              : `${typingUsers.length} people typing…`}
          </div>
        )}
      </div>
    );
  }
);
