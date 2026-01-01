import { useEffect, useState } from "react";
import ProductImageMagnifier from "./ProductImageMagnifier";

export default function ProductViewModel({
  isOpen,
  onClose,
  media,
  initialIndex = 0,
}) {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) setSelectedIndex(initialIndex);
  }, [isOpen, initialIndex]);

  if (!isOpen) return null;

  const selected = media[selectedIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-3xl z-50 hover:scale-110"
      >
        &times;
      </button>

      <div className="flex gap-20 h-full w-full items-center justify-center p-12">
        <div className="relative max-w-3xl aspect-video rounded-xl bg-white p-2">
          {selectedIndex > 0 && (
            <button
              onClick={() => setSelectedIndex((prev) => prev - 1)}
              className="absolute left-[14px] -translate-y-[50%] top-[50%] text-gray-800 bg-white rounded-full shadow-lg z-40 hover:scale-105 flex text-[20px] w-[30px] h-[30px] item-center justify-center"
            >
              &#8249;
            </button>
          )}
          {selected.imageUrl.endsWith(".mp4") ? (
            <video
              src={selected.imageUrl}
              controls
              className="w-full h-full object-contain rounded"
            />
          ) : (
            <>
              <ProductImageMagnifier
                src={selected.imageUrl}
                alt={selected.altText}
                zoom={5.5}
              />
            </>
          )}
          {selectedIndex < media.length - 1 && (
            <button
              onClick={() => setSelectedIndex((prev) => prev + 1)}
              className="absolute right-[14px] -translate-y-[50%] top-[50%] text-gray-800 bg-white rounded-full shadow-lg z-40 hover:scale-105 flex text-[20px] w-[30px] h-[30px] item-center justify-center"
            >
              &#8250;
            </button>
          )}
        </div>

        <div className="backdrop-blur-sm max-h-[80%] overflow-y-auto p-1 rounded-xl space-y-3 w-32">
          {media.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-300 ${
                selectedIndex === idx ? "border-white" : "border-transparent"
              }`}
            >
              {item.imageUrl.endsWith(".mp4") ? (
                <video
                  src={item.imageUrl}
                  muted
                  className="w-full aspect-square object-cover rounded"
                />
              ) : (
                <img
                  src={item.imageUrl}
                  alt={item.altText || "Thumbnail"}
                  className="w-full aspect-square object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
