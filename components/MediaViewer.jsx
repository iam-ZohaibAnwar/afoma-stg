import React from "react";

export default function MediaViewer({ media, onClose }) {
  if (!media) return null;

  const isImage = media.fileType.startsWith("image/");
  const isVideo = media.fileType.startsWith("video/");

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>
        {isImage && (
          <img
            src={media.url}
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              borderRadius: 10,
            }}
          />
        )}

        {isVideo && (
          <video
            src={media.url}
            controls
            autoPlay
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              borderRadius: 10,
            }}
          />
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: 30,
          right: 30,
          fontSize: 30,
          background: "none",
          border: "none",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </div>
  );
}
