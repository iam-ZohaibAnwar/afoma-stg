import React from "react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  header,
  message,
  confirmText,
  bgClass,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-orange-50 rounded-lg shadow-lg p-6 max-w-sm w-full">
        {/* Header */}
        <h2 className="text-lg font-semibold mb-4">{header}</h2>
        {/* Message */}
        <p className="mb-6">{message}</p>
        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 hover:opacity-70 rounded-md text-primary"
          >
            Close
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2  hover:opacity-70 text-white rounded-md ${bgClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
