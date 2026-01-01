import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentRequestButtonElement } from '@stripe/react-stripe-js';

const GooglePayModal = ({ amount, onClose }) => {
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createPaymentRequest = async () => {
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: 'Total',
          amount: amount,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
        setLoading(false);
      });
    };

    createPaymentRequest();
  }, [amount]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="border-4 border-blue-500 border-t-transparent rounded-full w-8 h-8 animate-spin"></div>
        <span className="ml-2">Loading Google Pay...</span>
      </div>
    );
  }

  if (!paymentRequest) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Google Pay is not available in your browser.</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">Close</button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <PaymentRequestButtonElement
        options={{ paymentRequest }}
        onReady={() => {
          console.log('PaymentRequestButtonElement [ready]');
        }}
        onClick={(event) => {
          console.log('PaymentRequestButtonElement [click]', event);
        }}
        onError={(err) => {
          console.error('PaymentRequestButtonElement [error]', err);
        }}
      />
    </div>
  );
};

const GooglePay = ({ amount, onClose }) => {
  return (
    <Elements stripe={loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)}>
      <GooglePayModal amount={amount} onClose={onClose} />
    </Elements>
  );
};

export default GooglePay;
