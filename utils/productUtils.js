// Product utility functions for calculations and formatting

export const formatPrice = (price) => {
  const numericPrice = Number(price);
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);
};

export const calculateTotalQuantity = (selectedAttributes, variations) => {
  if (!selectedAttributes || !variations || variations.length === 0) {
    return 0;
  }

  const matchingVariation = variations.find((variation) => {
    for (const attribute in selectedAttributes) {
      if (selectedAttributes[attribute] !== variation[attribute]) {
        return false;
      }
    }
    return true;
  });

  return matchingVariation ? matchingVariation.quantity : 0;
};

export const getUniqueValues = (array, attribute) => {
  const values = new Set();
  array.forEach((item) => {
    if (item && item[attribute] !== undefined) {
      values.add(item[attribute]);
    }
  });
  return Array.from(values);
};

export const getPriceForSelectedAttributes = (selectedAttributes, variations, initialPrice) => {
  const selectedVariation = variations.find((variation) =>
    Object.entries(selectedAttributes).every(
      ([key, value]) => variation[key] === value
    )
  );

  if (selectedVariation) {
    return (
      selectedVariation?.surTotalAmount ||
      selectedVariation?.finalPrice ||
      initialPrice
    );
  } else {
    return initialPrice;
  }
};

export const getPriceForSelectedAttributesWithOutSurcharge = (selectedAttributes, variations, initialPriceSurcharge) => {
  const selectedVariation = variations.find((variation) =>
    Object.entries(selectedAttributes).every(
      ([key, value]) => variation[key] === value
    )
  );

  if (selectedVariation) {
    return (
      selectedVariation?.finalPrice ||
      selectedVariation?.price ||
      initialPriceSurcharge
    );
  } else {
    return initialPriceSurcharge;
  }
};

export const getActualPriceForSelectedAttributes = (selectedAttributes, variations, initialActualPrice) => {
  const selectedVariation = variations.find((variation) =>
    Object.entries(selectedAttributes).every(
      ([key, value]) => variation[key] === value
    )
  );

  if (selectedVariation) {
    return (
      selectedVariation?.surTotalAmountBDis ||
      selectedVariation?.surTotalAmount ||
      selectedVariation?.totalPrice ||
      initialActualPrice
    );
  } else {
    return initialActualPrice;
  }
};

export const calculateInventory = (selectedAttributes, variations) => {
  if (variations) {
    const selectedVariation = variations.find((variation) =>
      Object.entries(selectedAttributes).every(
        ([key, value]) => variation[key] === value
      )
    );

    return selectedVariation ? selectedVariation.inventory : "Out of Stock";
  }
  return "Out of Stock";
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const generateStarIcons = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push({
      type: 'full',
      key: i
    });
  }

  if (halfStar) {
    stars.push({
      type: 'half',
      key: 'half'
    });
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push({
      type: 'empty',
      key: `empty-${i}`
    });
  }

  return stars;
};

export const checkSelectedVariantInCart = (product, selectedVariant) => {
  if (product && selectedVariant) {
    const uniqueId = `${product._id}_${selectedVariant}`;
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    return uniqueId in cart;
  }
  return false;
};

export const getInitialPrices = (variations) => {
  if (!variations || variations.length === 0) return {};

  return {
    initialPrice: variations[0]?.surTotalAmount
      ? variations[0]?.surTotalAmount
      : variations[0].finalPrice,
    initialActualPrice: variations[0]?.surTotalAmountBDis ||
      variations[0]?.surTotalAmount ||
      variations[0].totalPrice,
    initialPriceSurcharge: variations[0].finalPrice || variations[0].price
  };
};

export const getCalculatedPrices = (selectedAttributes, variations, initialPrices) => {
  if (!selectedAttributes || Object.keys(selectedAttributes).length === 0) {
    return {
      calculatedPrice: initialPrices.initialPrice || " ",
      calculatedPriceSurcharge: initialPrices.initialPriceSurcharge || " ",
      calculatedActualPrice: initialPrices.initialActualPrice || " "
    };
  }

  const calculatedPrice = getPriceForSelectedAttributes(selectedAttributes, variations, initialPrices.initialPrice) || " ";
  const calculatedPriceSurcharge = getPriceForSelectedAttributesWithOutSurcharge(selectedAttributes, variations, initialPrices.initialPriceSurcharge) || " ";
  const calculatedActualPrice = getActualPriceForSelectedAttributes(selectedAttributes, variations, initialPrices.initialActualPrice) || " ";

  return {
    calculatedPrice,
    calculatedPriceSurcharge,
    calculatedActualPrice
  };
};
