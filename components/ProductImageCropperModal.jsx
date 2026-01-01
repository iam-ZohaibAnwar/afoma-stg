import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Field, Form } from "formik";
import { Fragment, useEffect, useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ASPECT_RATIO = 1;

const ProductImageCropperModal = ({
  onImageUpload,
  setError,
  imageLoading,
}) => {
  const [modalError, setModalError] = useState("");
  const [altText, setAltText] = useState("");

  const [imgCropperOpen, setImgCropperOpen] = useState(false);
  const [productImageSrc, setProductImageSrc] = useState(null);
  const productImgInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [crop, setCrop] = useState({
    height: 320,
    unit: "px",
    width: 320,
    x: 0,
    y: 0,
  });
  const imgRef = useRef(null);

  const mimeToExtension = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/bmp": "bmp",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  };

  useEffect(() => {
    if (imgCropperOpen) {
      setAltText(""); // Clear the altText when the modal is opened
    }
  }, [imgCropperOpen]);

  const onImageLoad = () => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop({
        unit: "px",
        width: Math.min(width, 320),
        height: Math.min(height, 320),
        x: (width - 320) / 2,
        y: (height - 320) / 2,
      });
    }
  };

  const base64ToFile = (base64String, fileNameWithoutExtension) => {
    try {
      const mimeType = base64String.match(/data:([^;]+);base64,/)[1];
      const extension = mimeToExtension[mimeType];
      if (!extension) {
        throw new Error("Unsupported MIME type: " + mimeType);
      }

      const byteString = atob(base64String.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([ab], { type: mimeType });
      const file = new File(
        [blob],
        `${fileNameWithoutExtension}.${extension}`,
        {
          type: mimeType,
        }
      );
      return file;
    } catch (error) {
      console.error("Error converting base64 to file:", error);
      throw error;
    }
  };

  const closeCropperModal = () => {
    setImgCropperOpen(false);
    if (productImgInputRef.current) {
      productImgInputRef.current.value = "";
      productImgInputRef.current.type = "file";
    }
  };

  const handleCrop = () => {
    setModalError("");
    setLoading(true);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx || !imgRef.current) return;

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = Math.floor(crop.width * scaleX);
    canvas.height = Math.floor(crop.height * scaleY);

    ctx.drawImage(
      imgRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    let quality = 0.8;
    let dataUrl = canvas.toDataURL("image/jpeg", quality);

    while (dataUrl.length > 5 * 1024 * 1024 && quality > 0) {
      quality -= 0.1;
      dataUrl = canvas.toDataURL("image/jpeg", quality);
    }

    const convertedFile = base64ToFile(dataUrl, "product_image");

    if (convertedFile.size > 5 * 1024 * 1024) {
      setModalError("Cropped image size exceeds 5MB limit.");
      setLoading(false);
      return;
    }

    setLoading(false);
    closeCropperModal();
    onImageUpload(convertedFile, altText);
  };

  return (
    <>
      <input
        ref={productImgInputRef}
        type="file"
        disabled={imageLoading}
        className="block w-full font-medium text-sm text-slate-600 file:mr-4 file:p-3.5 file:rounded file:border-0 file:text-sm file:bg-orange-100 file:font-medium file:text-blue-950 file:cursor-pointer focus:outline-none !p-0"
        accept="image/png, image/gif, image/jpeg, image/jpg"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file && file.size > 5 * 1024 * 1024) {
            setError("Image size should be less than 5MB");
            return;
          }
          if (file) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
              const image = reader.result?.toString() || "";
              setProductImageSrc(image);
            });
            reader.readAsDataURL(file);
            setImgCropperOpen(true);
            setError(null);
          }
        }}
      />
      <Transition appear show={imgCropperOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeCropperModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-[100%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[40%] transform rounded overflow-hidden bg-orange-100 px-6 py-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex align-middle justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-xl text-center font-medium leading-6 text-gray-900"
                    >
                      Crop Product Image
                    </Dialog.Title>
                    <div>
                      <FontAwesomeIcon
                        icon={faClose}
                        onClick={closeCropperModal}
                        className="text-2xl cursor-pointer text-gray-900"
                        aria-label="Close cropper modal"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    {productImageSrc && (
                      <div className="flex flex-col items-center">
                        <ReactCrop
                          crop={crop}
                          onChange={(pixelCrop) => setCrop(pixelCrop)}
                          aspect={ASPECT_RATIO}
                          keepSelection={true}
                          // maxWidth={320}
                          // maxHeight={380}
                          // minWidth={320}
                          // minHeight={380}
                        >
                          <img
                            ref={imgRef}
                            src={productImageSrc}
                            alt="Upload"
                            onLoad={onImageLoad}
                            style={
                              {
                                // maxHeight: "420px",
                                // height: "420px",
                                // minHeight: "420px",
                                // minWidth: "320px",
                                // width: "320px",
                                // maxWidth: "320px",
                                // objectFit: "contain",
                              }
                            }
                          />
                        </ReactCrop>
                        <Form className="st-form w-full mt-4">
                          <div className="">
                            <Field
                              type="text"
                              name="altText"
                              id="altText"
                              required={true}
                              placeholder="Enter Image Description"
                              value={altText} // Binds the `altText` state to the field
                              onChange={(e) => setAltText(e.target.value)} // Updates `altText` state on input change
                            />
                            {altText ? (
                              ""
                            ) : (
                              <>
                                <div className="text-xs text-red-600">
                                  Image description required
                                </div>
                              </>
                            )}
                          </div>
                        </Form>
                        <button
                          className="text-white font-mono text-xs py-2 px-4 rounded-2xl mt-4 bg-sky-500 hover:bg-sky-600 disabled:opacity-40"
                          disabled={loading || !altText}
                          onClick={handleCrop}
                        >
                          {loading ? "Loading..." : "Crop Image"}
                        </button>
                        <div className="text-center mt-2 text-[#dc2626]">
                          {modalError}
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ProductImageCropperModal;
