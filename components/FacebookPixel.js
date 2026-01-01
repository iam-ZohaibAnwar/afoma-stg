// components/FacebookPixel.js
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const FacebookPixel = ({ data }) => {
  const router = useRouter();
  const hasTrackedRef = useRef(false);

  const getEventName = () => {
    if (router.route === '/cart') return 'AddToCart';
    if (router.route === '/checkout') return 'InitiateCheckout';
    if (router.route === '/category/[categoryId]/[subCategoryId]/[...productId]') return 'ViewContent';
  };

  useEffect(() => {
    if (hasTrackedRef.current || !window.fbq) return;

    const eventName = getEventName();
    if (!eventName) return;

    let parameters = {};
    if (data?.isProduct && data?.product?.sku) {
      parameters = {
        sku: data.product.sku,
        productType: data.product.productType,
      };
      if (data.addToCart) {
        parameters.value = data.value;
      }
    } else if (!data?.isProduct && data?.cart) {
      let sku = Object.keys(data.cart)
        .map((k) => data?.cart[k].productData.sku)
        .join(', ');
      parameters = {
        skus: sku,
        totalValue: data.cartValue?.toFixed(2),
      };
    }

    // console.log('Tracking Facebook Pixel:', eventName, parameters);
    fbq('track', eventName, parameters);
    hasTrackedRef.current = true;
  }, [router.route, data]);

  return null;
};

export default FacebookPixel;
