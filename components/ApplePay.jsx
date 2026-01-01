import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentRequestButtonElement, useStripe } from "@stripe/react-stripe-js";

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

function ApplePayButton({ clientSecret, productName, amount, onSuccess }) {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [canPay, setCanPay] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    const pr = stripe.paymentRequest({
      country: "CA",
      currency: amount.currency_code.toLowerCase(),
      total: {
        label: productName || "Product",
        amount: toStripeAmount(amount.value, amount.currency_code), // convert dollars → cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    pr.canMakePayment().then((result) => {
      console.log('result :>> ', result);
      if (result && result?.applePay) {
        setPaymentRequest(pr);
        setCanPay(true);
      }
    });

    pr.on("paymentmethod", async (ev) => {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: ev.paymentMethod.id,
      });

      if (result.error) {
        ev.complete("fail");
        alert(result.error.message);
      } else {
        if (result?.paymentIntent?.id) {
          result.paymentIntent.orderID = result.paymentIntent.id
          result.paymentIntent.paymentType = "stripe"
          onSuccess(result?.paymentIntent);
        }
        ev.complete("success");
      }
    });

  }, [stripe, clientSecret]);

  if (!canPay) return console.log("Apple Pay is not available on this device/browser.")

  return <PaymentRequestButtonElement
    options={{
      paymentRequest,
      style: {
        paymentRequestButton: {
          height: "55px", // only this is customized
        },
      },
    }}
  />

}

export default function ApplePay({ amount, productName, onSuccess }) {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    if (!amount?.value) {
      console.log("failed to get amount")
      return
    }
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: toStripeAmount(amount.value, amount.currency_code),
        currency_code: amount.currency_code.toLowerCase(),
        productName: productName || "Product"
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount, productName]);

  if (!clientSecret) {
    return (
      <div className="h-[55px] w-full bg-gray-200 rounded-md animate-pulse" />
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <ApplePayButton
        clientSecret={clientSecret}
        productName={productName}
        amount={amount}
        onSuccess={onSuccess}
      />
    </Elements>
  );
}
