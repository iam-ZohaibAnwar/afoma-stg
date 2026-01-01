import { useState, useEffect, useRef } from "react";

export function ChatInput({
  onSend,
  onTyping,
  onSendAttachment,
  editMessage,
  onEdit,
  onEditCancel,
}) {
  const [text, setText] = useState(editMessage?.text || "");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  // Use CSS media queries for responsiveness
  // Track mobile by CSS rather than JS
  useEffect(() => {
    if (editMessage) setText(editMessage.text || "");
  }, [editMessage]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (editMessage) {
      onEdit(editMessage._id, trimmed);
    } else {
      onSend(trimmed);
    }
    setText("");
    if (inputRef.current) inputRef.current.blur();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    } else {
      onTyping?.();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(1);

    try {
      await onSendAttachment(file, (percent) => {
        setUploadProgress(percent);
      });
    } finally {
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  // Styles for responsiveness using CSS clamp and media query-like design
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      background: "#F6F2EF",
      borderTop: "1.2px solid #ECD5CD",
      // Use clamp for responsive padding
      padding: "clamp(6px, 2vw, 14px) clamp(10px, 3vw, 18px)",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "clamp(6px, 2vw, 14px)",
    },
    label: {
      background: "#E8D6CF",
      padding: "clamp(8px, 2vw, 10px) clamp(10px, 3vw, 13px)",
      borderRadius: 14,
      cursor: uploading ? "not-allowed" : "pointer",
      opacity: uploading ? 0.5 : 1,
      display: "flex",
      alignItems: "center",
      minWidth: "clamp(28px, 7vw, 40px)",
      justifyContent: "center",
      fontSize: "clamp(17px, 4vw, 20px)",
    },
    input: {
      flex: 1,
      padding: "clamp(8px, 2.2vw, 12px) clamp(12px, 4vw, 16px)",
      borderRadius: 20,
      border: "1.2px solid #ECE3DC",
      fontSize: "clamp(13px, 3.1vw, 16px)",
      outline: "none",
      minWidth: 0, // allow shrinking
    },
    button: {
      padding: "clamp(6px, 2vw, 8px) clamp(12px, 4vw, 20px)",
      borderRadius: 18,
      background: uploading ? "#d3b4a8" : "#E05D3F",
      color: "#fff",
      fontSize: "clamp(13px, 3.1vw, 16px)",
      border: "none",
      cursor: uploading ? "not-allowed" : "pointer",
      whiteSpace: "nowrap",
      transition: "background 0.15s",
    },
    cancel: {
      padding: "clamp(6px, 2vw, 8px) clamp(10px, 4vw, 16px)",
      borderRadius: 18,
      background: "#aaa",
      color: "#fff",
      fontSize: "clamp(13px, 3.1vw, 16px)",
      border: "none",
      cursor: uploading ? "not-allowed" : "pointer",
      whiteSpace: "nowrap",
      marginRight: "clamp(6px, 2vw, 12px)",
      transition: "background 0.15s",
    },
    uploadBar: {
      height: 6,
      width: "100%",
      background: "#e8d6cf",
      borderRadius: 4,
      overflow: "hidden",
      marginBottom: "clamp(3px, 1vw, 7px)",
    },
    progress: {
      height: "100%",
      width: `${uploadProgress}%`,
      transition: "width 0.2s",
      background: "#E05D3F",
    },
  };

  return (
    <div data-chat-input style={styles.container}>
      {/* Upload progress bar */}
      {uploading && (
        <div style={styles.uploadBar}>
          <div style={styles.progress} />
        </div>
      )}
      <div style={styles.row}>
        {/* Upload button */}
        <label style={styles.label}>
          <span style={{ fontSize: styles.label.fontSize }}>📎</span>
          <input
            type="file"
            style={{ display: "none" }}
            disabled={uploading}
            onChange={handleFileChange}
          />
        </label>

        {/* Text input */}
        <input
          ref={inputRef}
          type="text"
          value={text}
          disabled={uploading}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            uploading
              ? `Uploading ${uploadProgress}%...`
              : editMessage
              ? "Edit message…"
              : "Type a message…"
          }
          style={styles.input}
        />

        {/* Cancel edit button */}
        {editMessage && (
          <button
            onClick={onEditCancel}
            disabled={uploading}
            style={styles.cancel}
          >
            Cancel
          </button>
        )}

        {/* Send/Save button */}
        <button
          onClick={handleSend}
          disabled={uploading}
          style={styles.button}
        >
          {editMessage ? "Save" : "Send"}
        </button>
      </div>
      {/* Responsive style for mobile using CSS */}
      <style>{`
        @media (max-width: 600px) {
          [data-chat-input] input[type="text"] {
            font-size: 14px !important;
          }
          [data-chat-input] label span {
            font-size: 18px !important;
          }
          [data-chat-input] button {
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
}
