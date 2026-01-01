import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Image from 'next/image'; // Assuming you're using Next.js or similar
import axios from 'axios';
import { useRouter } from 'next/router';
import { calculateSurcharge } from '@/utils/pricingUtils';

// Custom CSS to hide scrollbar
const scrollbarHideStyle = `
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
`;

const NotificationDropdown = ({ cart, addToCart }) => {

    // State for showing/hiding the notification dropdown
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const router = useRouter();
    // Example notifications with product image and details, now including read status and timestamp
    const [notifications, setNotifications] = useState([
        // {
        //     id: 1,
        //     name: "NegreHerzing sent an offer for an item you left in your basket.",
        //     description: "5% off with code THANKYOU5OFF",
        //     productImage: "/path-to-your-image.jpg", // Replace with actual image path or URL
        //     offerDetails: "Terms may apply. Visit shop for details.",
        //     isRead: false,
        //     timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        // },
        // {
        //     id: 2,
        //     name: "New order placed!",
        //     description: "Congratulations on your order. Track your shipment.",
        //     productImage: "/path-to-your-image.jpg", // Replace with actual image path or URL
        //     offerDetails: "Track your order in the 'Orders' section.",
        //     isRead: true,
        //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        // },
        // Add more notifications here
    ]);

    const getNotifications = async (userId) => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/notifications?userId=${userId}`, {
                headers: {
                    "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
                }
            }
            );
            setNotifications(response.data);
        } catch (error) {
            console.error("Error fetching sellers:", error);
        }
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            const userId = user.userId ? user.userId : user._id
            getNotifications(userId)
        }
    }, [])

    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
    };

    const markAsRead = (id) => {
        const notification = notifications.find(notif => notif._id === id);
        if (notification) {
            notification.isRead = true
            updateNotification(notification)
        }
    };

    const deleteNotification = async (id) => {
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/${id}`, {
                headers: {
                    "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
                }
            }
            );
            if (response.data.success) {
                console.log("abc")
                setNotifications(notifications.filter(notif => notif._id !== id))
            }
        } catch (err) {
            console.error("deleting notification:", err);
        }
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const createdAt = new Date(timestamp); // 
        const diff = now - createdAt;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const updateNotification = async (notification) => {
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_BASE_URL}/notifications/${notification._id}`, {}, {
                headers: {
                    "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
                }
            }
            );
            if (response.data.success) {
                setNotifications(notifications.map(notif => notif._id !== response.data._id ? { ...notif, isRead: true } : notif))
            }
        } catch (err) {
            console.error("updating status notification:", err);
        }
    }

    const addProductToCart = async (notification) => {
        markAsRead(notification._id)
        const prod = notification.product
        // Get existing cart
        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
        const keys = Object.keys(existingCart)
        // Check if already added
        const existingItem = keys.find(key => existingCart[key].productData._id === prod.id);
        if (!existingItem) {
            //call backend to get product
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/products/${prod.id}`, {
                headers: {
                    "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
                }
            }
            );
            let product = response?.data
            if (product) {
                product = calculateSurcharge([product])?.[0];
                if (product.productType == "Customizable") {
                    const initialPriceSurcharge =
                        product.variations && product.variations.length > 0
                            ? product.variations[0].finalPrice || product.variations[0].price
                            : null;
                    const calculatedPriceSurcharge =
                        Object.keys(prod.selectedVariation).length > 0
                            ? getPriceForSelectedAttributesWithOutSurcharge(product.variations, prod.selectedVariation) || " "
                            : initialPriceSurcharge || " ";
                    const attributeArray = []
                    Object.keys(product.variations[0]).forEach((attribute) => {
                        if (
                            attribute !== "inventory" &&
                            attribute !== "quantity" &&
                            attribute !== "price" &&
                            attribute !== "image" &&
                            attribute !== "totalPrice" &&
                            attribute !== "finalPrice" &&
                            attribute !== "surTotalAmount" &&
                            attribute !== "surTotalAmountBDis" &&
                            attribute !== "currencyPrice"
                        ) {
                            const attributeName = attribute;
                            const attributeValue =
                                prod.selectedVariation[attribute] !== undefined
                                    ? prod.selectedVariation[attribute]
                                    : `${product.variations[0][attribute]}`;
                            attributeArray.push({ attributeName, attributeValue });
                        }
                    });
                    let productId = product?._id;
                    if (
                        attributeArray &&
                        Array.isArray(attributeArray) &&
                        attributeArray.length
                    ) {
                        productId = `${productId}_${attributeArray
                            .map((variation) =>
                                variation.attributeValue.replace(
                                    /\s+/g,
                                    ""
                                )
                            )
                            .join("_")}`;
                    }
                    addToCart(
                        productId,
                        1,
                        1,
                        calculatedPriceSurcharge,
                        product,
                        "",
                        [],
                        "",
                        0,
                        attributeArray
                    );
                } else {
                    addToCart(
                        product?._id,
                        1,
                        1,
                        product?.quantity ? product?.quantity : "",
                        product?.finalPrice,
                        product,
                        "",
                        [],
                        "",
                        0
                    );
                }
            }

        }

        localStorage.setItem("applyCoupon", JSON.stringify(notification.couponId))
        router.push(`/cart`);
    };

    const getPriceForSelectedAttributesWithOutSurcharge = (variations, selectedAttributes) => {
        const selectedVariation = variations.find((variation) =>
            Object.entries(selectedAttributes).every(
                ([key, value]) => variation[key] === value
            )
        );
        const initialPrice =
            variations && variations.length > 0
                ? variations[0]?.surTotalAmount
                    ? variations[0]?.surTotalAmount
                    : variations[0].finalPrice
                : null;

        if (selectedVariation) {
            // Check if all attributes are selected
            const allAttributesSelected =
                Object.keys(selectedAttributes).length ===
                Object.keys(variations[0]).filter(
                    (attribute) =>
                        attribute !== "inventory" &&
                        attribute !== "quantity" &&
                        attribute !== "image" &&
                        attribute !== "price" &&
                        attribute !== "totalPrice" &&
                        attribute !== "finalPrice" &&
                        attribute !== "surTotalAmount" &&
                        attribute !== "surTotalAmountBDis"
                ).length;
            // If all attributes are selected, return the selected variation's price
            // Otherwise, return the initial price
            // product.surTotalAmount = selectedVariation?.finalPrice || selectedVariation?.totalPrice || selectedVariation?.price || initialPrice
            return (
                selectedVariation?.finalPrice ||
                selectedVariation?.price ||
                initialPrice
            );
        } else {
            return initialPrice;
        }
    };

    return (
        <>
            <style jsx>{scrollbarHideStyle}</style>
            <div className="relative flex items-center gap-4">
                {/* Notification Icon */}
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <Menu.Button
                            onClick={toggleNotifications}
                            className="relative flex items-center justify-center text-blue-950 text-sm font-medium p-2 rounded-full transition-colors duration-200"
                            aria-label="Notifications"
                        >
                            {/* Bell Icon Wrapper (position relative for badge alignment) */}
                            <div className="relative">
                                {/* Bell Icon SVG */}
                                <svg
                                    viewBox="0 0 640 640"
                                    className={`h-7 w-7 text-blue-950 hover:text-blue-800 transition-colors duration-200 ${notifications.some((n) => !n.isRead) ? "animate-pulse" : ""
                                        }`}
                                    aria-hidden="true"
                                >
                                    <path d="M320 64C306.7 64 296 74.7 296 88L296 97.7C214.6 109.3 152 179.4 152 264L152 278.5C152 316.2 142 353.2 123 385.8L101.1 423.2C97.8 429 96 435.5 96 442.2C96 463.1 112.9 480 133.8 480L506.2 480C527.1 480 544 463.1 544 442.2C544 435.5 542.2 428.9 538.9 423.2L517 385.7C498 353.1 488 316.1 488 278.4L488 263.9C488 179.3 425.4 109.2 344 97.6L344 87.9C344 74.6 333.3 63.9 320 63.9zM488.4 432L151.5 432L164.4 409.9C187.7 370 200 324.6 200 278.5L200 264C200 197.7 253.7 144 320 144C386.3 144 440 197.7 440 264L440 278.5C440 324.7 452.3 370 475.5 409.9L488.4 432zM252.1 528C262 556 288.7 576 320 576C351.3 576 378 556 387.9 528L252.1 528z" />
                                </svg>

                                {/* Notification Count Badge */}
                                {notifications.filter((n) => !n.isRead).length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-rose-600 text-white h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-semibold shadow-md">
                                        {notifications.filter((n) => !n.isRead).length}
                                    </span>
                                )}
                            </div>
                        </Menu.Button>
                    </div>

                    <Transition as={Fragment}>
                        <Menu.Items className="absolute mt-2 -right-[17rem] w-80 sm:w-80 max-h-96 overflow-y-auto scrollbar-hide origin-top-right bg-orange-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 border border-gray-200">
                            <div className="px-4 py-3">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                                    <span className="text-xs text-white bg-orange-500 px-2 py-1 rounded">
                                        {notifications.filter(n => !n.isRead).length} unread
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => (
                                            <Menu.Item key={notification.id}>
                                                <div
                                                    className={`flex flex-col gap-3 p-3 rounded-lg ${!notification.isRead
                                                            ? "bg-orange-50 border-l-4 border-orange-400"
                                                            : "bg-orange-50"
                                                        } border border-gray-100`}
                                                >
                                                    {/* Product or Coupon Display */}
                                                    <div className="flex items-start gap-3">
                                                        {/* Conditionally show image only if product exists */}
                                                        {notification.product?.image ? (
                                                            <Image
                                                                src={notification.product.image}
                                                                alt="Product"
                                                                width={50}
                                                                height={50}
                                                                className="object-cover rounded border border-gray-200"
                                                            />
                                                        ) : (
                                                            <div className="w-[50px] h-[50px] flex items-center justify-center bg-orange-100 rounded text-orange-600 font-bold text-sm border border-gray-200">
                                                                🎁
                                                            </div>
                                                        )}

                                                        {/* Text Content */}
                                                        <div className="flex-1 min-w-0">
                                                            {notification.product ? (
                                                                <>
                                                                    <p
                                                                        className={`text-sm font-medium text-gray-900 leading-tight ${!notification.isRead ? "font-semibold" : ""
                                                                            }`}
                                                                    >
                                                                        {notification.product.name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {notification.product.offerDetails}
                                                                    </p>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <p
                                                                        className={`text-sm font-medium text-gray-900 leading-tight ${!notification.isRead ? "font-semibold" : ""
                                                                            }`}
                                                                    >
                                                                        {"Special Deal - Applicable on All Products"}
                                                                    </p>
                                                                        <p className="text-xs text-gray-500 mt-1">
                                                                            {notification.couponId
                                                                                ? `Flat ${notification.couponId.discountAmount}${notification.couponId.couponType === "percentage" ? "%" : ""
                                                                                } - use code ${notification.couponId.couponCode}`
                                                                                : ""}
                                                                        </p>
                                                                </>
                                                            )}

                                                            {/* Timestamp */}
                                                            <p className="text-xs text-gray-400 mt-2">
                                                                {formatTimestamp(notification.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center justify-between gap-2 mt-2">
                                                        <button
                                                            onClick={() => markAsRead(notification._id)}
                                                            className={`px-3 py-1 rounded text-xs font-medium ${notification.isRead
                                                                    ? "bg-orange-500 text-white cursor-not-allowed"
                                                                    : "bg-orange-500 text-white hover:bg-orange-600"
                                                                }`}
                                                            disabled={notification.isRead}
                                                        >
                                                            {notification.isRead ? "Read" : "Mark as Read"}
                                                        </button>

                                                        <button
                                                            onClick={() => deleteNotification(notification._id)}
                                                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                            aria-label="Delete notification"
                                                        >
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    {/* Conditionally show Add to Cart only if product exists */}
                                                    {notification.product && (
                                                        <button
                                                            className="w-full mt-2 px-3 py-2 buttonprimary text-white rounded text-sm font-medium flex items-center justify-center gap-2"
                                                            onClick={() => addProductToCart(notification)}
                                                        >
                                                            <svg
                                                                id="shopping-cart"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="23.273"
                                                                height="20.455"
                                                                viewBox="0 0 23.273 20.455"
                                                            >
                                                                <path
                                                                    d="M7.5,13.637H19.864a.682.682,0,0,0,.656-.495L23.247,3.6a.682.682,0,0,0-.656-.869H5.926L5.438.534A.682.682,0,0,0,4.773,0H.682a.682.682,0,0,0,0,1.364H4.226L6.688,12.442A2.045,2.045,0,0,0,7.5,16.364H19.864a.682.682,0,1,0,0-1.364H7.5a.682.682,0,0,1,0-1.363ZM21.687,4.091,19.35,12.273H8.047L6.229,4.091Zm0,0"
                                                                    fill="#f5f6f9ff"
                                                                />
                                                                <path
                                                                    d="M150,362.046A2.046,2.046,0,1,0,152.046,360,2.048,2.048,0,0,0,150,362.046Zm2.046-.682a.682.682,0,1,1-.682.682A.683.683,0,0,1,152.046,361.364Zm0,0"
                                                                    transform="translate(-143.182 -343.636)"
                                                                    fill="#f0f1f4ff"
                                                                />
                                                                <path
                                                                    d="M362,362.046A2.046,2.046,0,1,0,364.046,360,2.048,2.048,0,0,0,362,362.046Zm2.046-.682a.682.682,0,1,1-.682.682A.683.683,0,0,1,364.046,361.364Zm0,0"
                                                                    transform="translate(-345.545 -343.636)"
                                                                    fill="#e7e8edff"
                                                                />
                                                            </svg>
                                                            Add to Cart
                                                        </button>
                                                    )}
                                                </div>
                                            </Menu.Item>
                                        ))
                                    ) : (
                                        <div className="text-center py-6">
                                            <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-5 5v-5zM4.868 12.683A17.925 17.925 0 0112 21c7.962 0 12-1.21 12-2.683m-12 2.683a17.925 17.925 0 01-7.132-8.317M12 21c4.411 0 8-4.03 8-9s-3.589-9-8-9-8 4.03-8 9a9.06 9.06 0 001.832 5.683L4 21l4.868-8.317z" />
                                            </svg>
                                            <p className="mt-3 text-sm text-gray-500">No notifications yet</p>
                                            <p className="text-xs text-gray-400">We'll notify you when something important happens!</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </>
    );
};

export default NotificationDropdown;
