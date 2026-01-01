import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ImageUploader({ data, type }) {
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const [imageLoading, setImageLoading] = useState(false); // Track image loading
    const [submitLoading, setSubmitLoading] = useState(false); // Track submit loading
    const fileInputRef = useRef(null); // useRef to reference the file input

    useEffect(() => {
        if (data?.content) {
            setImages(JSON.parse(data.content));
        }
    }, [data]);

    const onImageUpload = (file, altText) => {
        setImageLoading(true); // Set loading state to true when uploading starts
        let formData = new FormData();
        formData.append('featuredimage', file);

        const options = {
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings/upload-image`, // Make sure to configure the correct API endpoint
            data: formData,
            headers: {
                'x-api-key': 'gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm', // Add API Key if needed
            },
        };

        axios
            .request(options)
            .then((response) => {
                const imgObj = {
                    imageUrl: response.data.imageUrl, // Assuming imageUrl is returned in the response
                    fileName: response.data.featuredimage,
                    altText: altText,
                };
                setImages((prevImages) => [...prevImages, imgObj]); // Add image to the list
                setImageLoading(false); // Reset loading state
            })
            .catch((error) => {
                console.error(error);
                setError(error.response.data.error || 'Error uploading image.');
                setImageLoading(false); // Reset loading state
            });
    };

    const handleImageUpload = async (event) => {
        const newImage = event.target.files[0];

        if (!newImage) return;

        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(newImage.type)) {
            setError('Invalid image type. Please upload a JPEG, PNG, or GIF image.');
            return;
        }

        setError('');
        setImageLoading(true); // Start uploading the new image

        // Call the image upload function using axios
        onImageUpload(newImage, `Uploaded Image ${images.length + 1}`);
    };

    const handleSubmit = async () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        const content = images

        // if (images.length === 0) {
        //     setError('No images uploaded.');
        //     return;
        // }

        if (userData && userData.userId) {
            // Prepare data for submission
            const requestData = {
                type: type, // Or any appropriate type you're submitting
                content: JSON.stringify(content), // Send the array of image URLs as content
                createdBy: userData.userId, // User ID from localStorage
            };

            setSubmitLoading(true); // Set submit loading to true

            try {
                let response = {};
                if (data?._id) {
                    response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/settings/${data?._id}`, requestData, {
                        headers: {
                            'x-api-key': 'gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm', // API Key
                            'Content-Type': 'application/json',
                        },
                    });
                } else {
                    response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/settings`, requestData, {
                        headers: {
                            'x-api-key': 'gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm', // API Key
                            'Content-Type': 'application/json',
                        },
                    });
                }

                setSubmitLoading(false); // Reset submit loading state

                if (response.status === 200) {
                    // Show success notification
                    toast.success("Settings Added successfully");
                    setError('');
                } else {
                    toast.error("Something Went Wrong");
                    setError('Error submitting images.');
                }
            } catch (err) {
                setSubmitLoading(false); // Reset submit loading state
                setError('Error submitting images.');
                toast.error("Something Went Wrong");
                console.error(err);
            }
        }
    };

    const removeImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={imageLoading} // Disable if any image is being uploaded
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {imageLoading && <p className="text-blue-500 text-sm">Uploading...</p>}

            <div className="mt-6">
                <h3 className="text-xl font-semibold">Uploaded Images:</h3>
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group w-40">
                            {/* Updated image size */}
                            <img
                                src={image?.imageUrl}
                                alt={image?.altText}
                                className="w-400 h-40 object-cover rounded-lg border" // Adjusted image size to w-40 and h-40
                            />
                            {/* Remove Button */}
                            <button
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex justify-between">
                {/* Trigger file input click */}
                <button
                    onClick={() => fileInputRef.current.click()} // Trigger file input click using useRef
                    className="buttonprimary"
                    disabled={imageLoading || type == "upload-images" ? images.length >= 5 : images.length >= 1} // Disable if uploading is in progress
                >
                    {imageLoading ? 'Uploading...' : 'Add Image'}
                </button>

                {/* {images.length > 0 && ( */}
                <button
                    onClick={handleSubmit}
                    className="buttonprimary disabled:opacity-50"
                    disabled={submitLoading} // Disable the button during submit
                >
                    {submitLoading ? (
                        'Loading...'
                    ) : (
                        'Submit Images'
                    )}
                </button>
                {/* )} */}
            </div>
        </div>
    );
}
