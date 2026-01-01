import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardBrand, setCardBrand] = useState('');
  const [billingName, setBillingName] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const elementOptions = {
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#1F628E', // Match theme primary
        colorText: '#374151',
        colorBackground: '#ffffff',
        colorTextPlaceholder: '#9ca3af',
        colorBorder: '#d1d5db',
        spacingUnit: '4px',
        borderRadius: '8px',
        fontSizeBase: '16px',
        fontFamily: 'Inter, system-ui, sans-serif',
      },
      rules: {
        '.Input': {
          padding: '16px',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        },
        '.Input--invalid': {
          borderColor: '#ef4444',
          boxShadow: '0 0 0 1px #ef4444',
        },
        '.Input--focus': {
          borderColor: '#1F628E',
          boxShadow: '0 0 0 2px rgba(31, 98, 142, 0.2)',
        },
      },
    },
  };

  const handleCardChange = (event) => {
    setCardBrand(event.brand || '');
  };

  const validateForm = () => {
    let valid = true;
    if (!billingName.trim()) {
      setNameError('Name is required');
      valid = false;
    } else {
      setNameError('');
    }
    if (!billingEmail.trim() || !/\S+@\S+\.\S+/.test(billingEmail)) {
      setEmailError('Valid email is required');
      valid = false;
    } else {
      setEmailError('');
    }
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !validateForm()) return;

    setIsProcessing(true);
    setError(null);

    const cardNumberElement = elements.getElement(CardNumberElement);

    const { paymentIntent, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: billingName,
            email: billingEmail,
          },
        },
      }
    );

    setIsProcessing(false);

    if (error) {
      setError(error.message);
    } else if (paymentIntent.status === 'succeeded') {
      paymentIntent.orderID = paymentIntent.id
      paymentIntent.paymentType = "stripe"
      onSuccess(paymentIntent);
    }
  };

  return (
    <div className="animate-fade-in max-w-lg mx-auto bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-200">
      {/* Header with Security Badge */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-2 text-green-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">Secure Payment</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Billing Name */}
        <div>
          <label htmlFor="billing-name" className="block text-sm font-semibold text-gray-800 mb-2">
            Full Name
          </label>
          <input
            id="billing-name"
            type="text"
            value={billingName}
            onChange={(e) => setBillingName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="John Doe"
            aria-describedby={nameError ? "name-error" : undefined}
          />
          {nameError && <p id="name-error" className="text-red-500 text-sm mt-1">{nameError}</p>}
        </div>

        {/* Billing Email */}
        <div>
          <label htmlFor="billing-email" className="block text-sm font-semibold text-gray-800 mb-2">
            Email Address
          </label>
          <input
            id="billing-email"
            type="email"
            value={billingEmail}
            onChange={(e) => setBillingEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            placeholder="john@example.com"
            aria-describedby={emailError ? "email-error" : undefined}
          />
          {emailError && <p id="email-error" className="text-red-500 text-sm mt-1">{emailError}</p>}
        </div>

        {/* Card Number with Brand Icon */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Card Number</label>
          <div className="relative">
            <CardNumberElement
              options={elementOptions}
              onChange={handleCardChange}
              className="w-full"
            />
            {cardBrand && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <img
                  src={`https://js.stripe.com/v3/card-icons/${cardBrand}.svg`}
                  alt={cardBrand}
                  className="w-6 h-6"
                />
              </div>
            )}
          </div>
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">Expiry Date</label>
            <CardExpiryElement options={elementOptions} className="w-full" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">CVC</label>
            <CardCvcElement options={elementOptions} className="w-full" />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold hover:bg-primaryHover focus:outline-none focus:ring-4 focus:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing Payment...</span>
            </>
          ) : (
            <span>Pay Securely</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
