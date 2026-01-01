import React, { useRef, useState } from "react";

export default function ProductImageMagnifier({ src, alt, zoom = 2 }) {
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0, visible: false });

  const handleMouseMove = (e) => {
    const { top, left, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    setPosition({ x, y, visible: true });
  };

  const handleMouseLeave = () => {
    setPosition({ ...position, visible: false });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden w-full max-w-md mx-auto border"
    >
      <img src={src} alt={alt} className="w-full object-cover" />
      {position.visible && (
        <div
          className="absolute pointer-events-none border-2 border-white rounded-full"
          style={{
            width: "150px",
            height: "150px",
            top: `${position.y}%`,
            left: `${position.x}%`,
            transform: "translate(-50%, -50%)",
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundSize: `${zoom * 100}%`,
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
}
