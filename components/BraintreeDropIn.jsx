'use client'

import { useEffect, useRef, useState } from 'react'
import DropIn from 'braintree-web-drop-in-react'
import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function BraintreeDropIn({ amount, onSuccess, onError }) {
    const instance = useRef(null)
    const [clientToken, setClientToken] = useState(null)

    // 1) Fetch client token
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/token`, {
            headers: { 'x-api-key': 'gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm' }
        })
            .then((r) => r.json())
            .then((d) => setClientToken(d.clientToken))
            .catch(onError)
    }, [onError])

    // 2) Send nonce + amount to your backend
    const handlePurchase = async () => {
        try {
            const { nonce } = await instance.current.requestPaymentMethod()
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/payments/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm'
                },
                body: JSON.stringify({ paymentMethodNonce: nonce, amount })
            })
            const data = await res.json()
            if (res.ok) onSuccess(data.transactionId)
            else throw new Error(data.error)
        } catch (err) {
            onError(err)
        }
    }

    // Loading skeleton
    if (!clientToken) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse" />
                <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
            </div>
        )
    }

    return (
        <>
            <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800 mb-4">
                <FontAwesomeIcon icon={faCreditCard} /> Pay with Card / Google Pay
            </h3>
            <div className="bg-white rounded-lg p-6 shadow-lg space-y-6 hover:shadow-xl transition-shadow">
                <DropIn
                    options={{
                        authorization: clientToken,
                        applePay: {
                            displayName: 'Your Store',
                            paymentRequest: {
                                total: { label: 'Total', amount }
                            }
                        },
                        googlePay: {
                            googlePayVersion: 2,
                            transactionInfo: {
                                totalPriceStatus: 'FINAL',
                                totalPriceLabel: 'Total',
                                totalPrice: amount,
                                currencyCode: 'USD'
                            },
                            allowedPaymentMethods: [
                                {
                                    type: 'CARD',
                                    parameters: {
                                        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                        allowedCardNetworks: ['VISA', 'MASTERCARD']
                                    }
                                }
                            ]
                        }
                    }}
                    onInstance={(inst) => (instance.current = inst)}
                />
                <button onClick={handlePurchase} className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-[#0070BA] text-white rounded-lg text-lg hover:bg-[#0068ba] transition duration-300"                >
                    <FontAwesomeIcon icon={faCreditCard} />
                    Pay ${amount}
                </button>
            </div>
        </>
    )
}
