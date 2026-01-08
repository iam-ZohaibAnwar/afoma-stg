import React, { useState, memo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlayCircle } from "@fortawesome/pro-regular-svg-icons";

// Lazy load Slider - CSS imports need to stay for styling
const Slider = dynamic(() => {
  if (typeof window !== "undefined") {
    require("slick-carousel/slick/slick.css");
    require("slick-carousel/slick/slick-theme.css");
  }
  return import("react-slick");
}, { 
  ssr: false,
  loading: () => <div className="h-[285px] w-[285px] md:w-[380px] md:h-[380px] bg-gray-200 animate-pulse rounded" />
});

const ProductImages = memo(({
  product,
  selectedImage,
  setSelectedImage,
  setSelectedVideo,
  setIsImageModalOpen,
  setIsViewProductDetailModalOpen,
  setSelectedImageIndex,
  sliderRef
}) => {
  const settings = {
    infinite: true,
    speed: 1000,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleImageClick = (image, viewModal = false, index = 0) => {
    setSelectedImage(image);
    setSelectedVideo(null);
    if (viewModal) {
      setIsViewProductDetailModalOpen(false);
      setIsImageModalOpen(true);
    }
    setSelectedImageIndex(index);
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setSelectedImage(null);
  };

  return (
    <div className="lg:flex lg:col-span-1 gap-5">
      {/* Thumbnail Images */}
      <div className="hidden lg:flex gap-4 shrink-0 items-start flex-col h-[380px] overflow-auto scrollbar">
        {product?.images?.map((image, index) => (
          <div key={index}>
            <Image
              src={image.imageUrl}
              alt={image.altText || "product_image"}
              width={76}
              height={84}
              className="border-[1px] hover:border-primary h-[84px] w-[76px] rounded object-cover cursor-pointer"
              onClick={() => handleImageClick(image)}
              loading="lazy"
              unoptimized={image.imageUrl?.includes("http")}
            />
          </div>
        ))}
      </div>

      {/* Main Image Display */}
      <div>
        <div className="flex sm:justify-start justify-center">
          <div className="relative overflow-visible group bg-white border border-slate-200 rounded mb-6 md:mb-6">
            {/* Share and Like buttons */}
            <div className="absolute bg-orange-50 w-8 h-8 rounded-full right-5 top-5 flex items-center justify-center z-10">
              <button
                className="container flex items-center justify-center z-10 opacity-50"
                disabled
                title="Coming soon..."
              >
                <svg
                  id="like_1_"
                  data-name="like (1)"
                  xmlns="http://www.w3.org/2000/svg"
                  width="17.563"
                  height="15.516"
                  viewBox="0 0 17.563 15.516"
                  className=""
                >
                  <g id="Group_26207" data-name="Group 26207" transform="translate(0 0)">
                    <path
                      id="Path_2296"
                      data-name="Path 2296"
                      d="M16.281,31.36a4.424,4.424,0,0,0-7.063.508,6.734,6.734,0,0,0-.437.709,6.728,6.728,0,0,0-.437-.709,4.424,4.424,0,0,0-7.063-.508A5.323,5.323,0,0,0,0,34.9a6.519,6.519,0,0,0,1.8,4.277,39.973,39.973,0,0,0,4.494,4.2c.68.579,1.382,1.178,2.131,1.833l.022.02a.515.515,0,0,0,.678,0l.022-.02c.748-.655,1.451-1.254,2.131-1.833a39.968,39.968,0,0,0,4.494-4.2,6.519,6.519,0,0,0,1.8-4.277A5.324,5.324,0,0,0,16.281,31.36ZM10.606,42.589c-.586.5-1.189,1.013-1.825,1.566-.636-.553-1.239-1.066-1.825-1.566C3.387,39.547,1.029,37.538,1.029,34.9a4.3,4.3,0,0,1,1.024-2.855,3.435,3.435,0,0,1,2.612-1.176,3.469,3.469,0,0,1,2.839,1.6,6.1,6.1,0,0,1,.788,1.566.515.515,0,0,0,.978,0,6.1,6.1,0,0,1,.788-1.566,3.4,3.4,0,0,1,5.451-.423A4.3,4.3,0,0,1,16.533,34.9C16.533,37.538,14.175,39.547,10.606,42.589Z"
                      transform="translate(0 -29.836)"
                      fill="#172554"
                    />
                  </g>
                </svg>
              </button>
            </div>

            {/* Share Menu - This would need to be passed as props or handled differently */}
            {/* Share functionality removed for now - can be added back as needed */}

            {/* Mobile Slider */}
            <div className={`relative h-[285px] w-[285px] md:w-[380px] md:h-[380px] z-0 flex items-center justify-center`}>
              <Slider {...settings} ref={sliderRef} className="sliderslick w-[285px] md:w-[380px] mx-auto">
                {product?.images?.map((image, index) => (
                  <div key={index}>
                    <Image
                      src={image.imageUrl}
                      alt={image.altText}
                      width={380}
                      height={380}
                      className="h-[285px] w-[285px] md:w-[380px] md:h-[380px] object-cover z-10 rounded cursor-pointer"
                      onClick={() => handleImageClick(image, true, index)}
                      loading="lazy"
                      unoptimized={image.imageUrl?.includes("http")}
                    />
                  </div>
                ))}
                {product?.videos?.map((video, index) => (
                  <div key={index}>
                    <div className="relative h-[285px] w-[285px] md:w-[380px] md:h-[380px] cursor-pointer">
                      <FontAwesomeIcon
                        icon={faPlayCircle}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-300 text-4xl z-10"
                      />
                      <video
                        src={video.videoUrl}
                        className="h-full w-full object-cover rounded"
                        preload="metadata"
                        muted
                        playsInline
                        crossOrigin="anonymous"
                        onClick={() => handleVideoClick(video)}
                      />
                    </div>
                  </div>
                ))}
              </Slider>
            </div>

            {/* Desktop Single Image */}
            <div className={`relative hidden w-[285px] h-[285px] md:w-[380px] md:h-[380px] z-0 lg:flex items-center justify-center`}>
              {selectedImage ? (
                <Image
                  src={selectedImage.imageUrl}
                  alt={selectedImage.altText || "product_image"}
                  width={380}
                  height={380}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => {
                    setSelectedImage(selectedImage);
                    setSelectedVideo(null);
                    setIsImageModalOpen(false);
                    setIsViewProductDetailModalOpen(true);
                    const index = product.images.findIndex(
                      (img) => img.imageUrl === selectedImage.imageUrl
                    );
                    setSelectedImageIndex(index);
                  }}
                  loading="lazy"
                  unoptimized={selectedImage.imageUrl?.includes("http")}
                />
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProductImages.displayName = "ProductImages";

export default ProductImages;
