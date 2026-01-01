
export const pushEventViewToCart = (cart, total) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    const items = mapItems(cart);

    window.dataLayer.push({
        event: "view_cart",
        ecommerce: {
            currency: "CAD",
            value: Number(Number(total).toFixed(2)),
            items: items
        },
    });
}

export const pushEventBeginCheckout = (cart, total) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    const items = mapItems(cart);
    window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
            currency: "CAD",
            value: Number(Number(total).toFixed(2)),
            items: items
        },
    });
}

export const pushEventPurchase = (payload, orderId) => {
    console.log(payload)
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    const items = mapItems(payload.cart);

    let cartTotal = parseFloat((parseFloat(payload.subTotal) + parseFloat(payload.totalShippingRate)).toFixed(2));
    // Calculate service fees (3% of cartTotal + 0.3)
    let serviceFees = parseFloat((cartTotal * 0.03 + 0.3).toFixed(2));
    // Calculate the final order price (cartTotal + serviceFees)
    let order_price = parseFloat((cartTotal + serviceFees).toFixed(2));

    window.dataLayer.push({
        event: "purchase",
        ecommerce: {
            transaction_id: orderId,
            value: Number(Number(order_price).toFixed(2)),
            tax: serviceFees,
            shipping: payload.totalShippingRate,
            currency: "CAD",
            coupon: payload.coupon,
            items: items
        },
    });
}

export const pushEventPaymentInfo = (cart, paymentMethod) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    const items = mapItems(cart);

    window.dataLayer.push({
        event: "add_payment_info",
        ecommerce: {
            payment_type: paymentMethod,
            currency: "CAD",
            items: items
        },
    });
}

export const pushEventRemoveCart = (cart) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    const item = mapItem(cart)
    window.dataLayer.push({
        event: "remove_from_cart",
        ecommerce: {
            items: item
        },
    });
}

const mapItems = (cart) => {
    console.log(cart)
  return Object.values(cart).map((order) => ({
    item_id: order.productData._id,
    item_name: order.productData.productName,
    item_brand: order.productData.seller?.storeSlug,
    item_category: order.productData?.Category?.name,
    item_category2: order.productData?.SubCategory?.name,
    price: formatPrice(order?.totalAmount || order.productData?.finalPrice),
    quantity: order.orderQuantiy,
    currency: "CAD",
    google_business_vertical: "retail",
  }));
};

const mapItem = (order) => {
    return [{
        item_id: order.productData._id,
        item_name: order.productData.productName,
        item_brand: order.productData.seller?.storeSlug,
        item_category: order.productData?.Category?.name,
        item_category2: order.productData?.SubCategory?.name,
        price: formatPrice(order?.totalAmount || order?.basePrice),
        quantity: order.orderQuantiy,
        currency: "CAD",
        google_business_vertical: "retail",
    }];
};

const formatPrice = (value) => Number(Number(value).toFixed(2));