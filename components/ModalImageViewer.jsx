import React, { useEffect } from "react";

export default function ModalImageViewer({
  isOpen,
  onClose,
  images,
  selectedIndex,
}) {
  const [currentIndex, setCurrentIndex] = React.useState(selectedIndex || 0);

  useEffect(() => {
    if (isOpen) setCurrentIndex(selectedIndex);
  }, [isOpen, selectedIndex]);

  const showPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const showNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-[999999]">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white text-3xl"
      >
        &times;
      </button>

      <div className="relative max-w-4xl w-full px-4">
        <img
          src={images[currentIndex].imageUrl}
          alt={images[currentIndex].altText ? images[currentIndex].altText : ""}
          className="w-full max-h-[80vh] object-contain rounded-xl shadow-lg"
        />

        <button
          onClick={showPrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 px-3 py-2 text-white text-2xl bg-black bg-opacity-50 hover:bg-opacity-80 rounded-r"
        >
          &#8592;
        </button>

        <button
          onClick={showNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 px-3 py-2 text-white text-2xl bg-black bg-opacity-50 hover:bg-opacity-80 rounded-l"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}
