import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentRequestButtonElement,
  useStripe,
} from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import axios from 'axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const StripePaymentOptions = ({ clientSecret, paymentRequest, modalMode, onSuccess }) => {
  const stripe = useStripe();

  return (
    <div>
      {!modalMode && <h2>Select Payment Method</h2>}

      {/* Google Pay / Apple Pay */}
      {!modalMode && paymentRequest ? (
        <div style={{ marginBottom: '20px' }}>
          <h4>Apple Pay / Google Pay</h4>
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
      ) : !modalMode && (
        <p>Your browser does not support Apple Pay / Google Pay.</p>
      )}

      {/* Card Payment */}
      <div>
        {!modalMode && <h4>Credit / Debit Card</h4>}
        <CheckoutForm clientSecret={clientSecret} onSuccess={onSuccess}/>
      </div>
    </div>
  );
};

const StripeComponent = ({ modalMode = false, amount = {currency_code: "CAD",value: ""}, onSuccess }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function toStripeAmount(amount, currency) {
    const zeroDecimalCurrencies = [
      "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga", "pyg", "rwf",
      "vnd", "vuv", "xaf", "xof", "xpf"
    ];

    // Normalize currency to lowercase
    const currencyLower = currency.toLowerCase();

    if (zeroDecimalCurrencies.includes(currencyLower)) {
      return Math.round(amount); // No multiplication
    } else {
      return Math.round(amount * 100); // Multiply by 100
    }
  }

  useEffect(() => {
    const fetchClientSecret = async () => {
      setLoading(true);
      setError(null);
      if (!amount?.value) {
        console.log("failed to get amount")
        return
      }
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/payments/payment/intent`,
          {
            amount: toStripeAmount(amount.value, amount.currency_code),
            currency_code: amount.currency_code.toLowerCase(),
            productName: "Product"
          },
          {
            headers: {
              'x-api-key': 'gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm',
            },
          }
        );

        const { client_secret } = response.data;
        setClientSecret(client_secret);

        // Setup Payment Request for Apple Pay / Google Pay only if not modalMode
        if (!modalMode) {
          const stripe = await stripePromise;
          const pr = stripe.paymentRequest({
            country: 'CA',
            currency: amount.currency_code.toLowerCase(),
            total: {
              label: 'Total',
              amount: toStripeAmount(amount.value,amount.currency_code),
            },
            requestPayerName: true,
            requestPayerEmail: true,
          });

          pr.canMakePayment().then((result) => {
            console.log(result)
            if (result) {
              setPaymentRequest(pr);
            }
          });
        }
      } catch (error) {
        console.error('Error fetching client secret:', error);
        setError('Failed to load payment options. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, [modalMode, amount]);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-xl border border-gray-200 animate-pulse">
        <div className="flex items-center justify-center mb-6">
          <div className="w-32 h-4 bg-gray-300 rounded"></div>
        </div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-300 rounded"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
          <div className="h-10 bg-gray-300 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-gray-300 rounded"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
          <div className="h-12 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto bg-red-50 p-8 rounded-2xl shadow-xl border border-red-200">
        <div className="flex items-center space-x-2 text-red-600">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentOptions
        clientSecret={clientSecret}
        paymentRequest={paymentRequest}
        modalMode={modalMode}
        onSuccess={onSuccess}
      />
    </Elements>
  );
};

export default StripeComponent;
