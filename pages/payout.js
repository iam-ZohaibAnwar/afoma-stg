import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import Footer from "@/components/Footer";
import Miniheader from "@/components/Miniheader";

// Payment method configuration
const paymentOptions = [
    {
        value: "NGN_Bank",
        label: "NGN Bank Transfer",
        fields: [
            { name: "bankCode", label: "Bank Code", type: "text", placeholder: "Enter bank Code" },
            { name: "accountNumber", label: "Account Number", type: "text", placeholder: "Enter your account number" },
            { name: "currency", label: "Currency", type: "text", placeholder: "Enter your currency code", defaultValue: "NGN", disabled: true },
            { name: "country", label: "Country", type: "text", placeholder: "Enter your country name", defaultValue: "Nigeria", disabled: true },
        ],
    },
    {
        value: "ZAR_Bank",
        label: "ZAR Bank Transfer",
        fields: [
            { name: "bankCode", label: "Bank Code", type: "text", placeholder: "Enter bank Code" },
            { name: "accountNumber", label: "Account Number", type: "text", placeholder: "Enter your account number" },
            { name: "accountName", label: "Account Name", type: "text", placeholder: "Enter your account name" },
            { name: "currency", label: "Currency", type: "text", placeholder: "Enter your currency code", defaultValue: "ZAR", disabled: true },
            { name: "country", label: "Country", type: "text", placeholder: "Enter your country name", defaultValue: "South Africa", disabled: true },
        ],
    },
    {
        value: "KES_Bank",
        label: "KES Bank Transfer",
        fields: [
            { name: "bankCode", label: "Bank Code", type: "text", placeholder: "Enter bank Code" },
            { name: "accountNumber", label: "Account Number", type: "text", placeholder: "Enter your account number" },
            { name: "accountName", label: "Account Name", type: "text", placeholder: "Enter your account name" },
            { name: "currency", label: "Currency", type: "text", placeholder: "Enter your currency code", defaultValue: "KES", disabled: true },
            { name: "country", label: "Country", type: "text", placeholder: "Enter your country name", defaultValue: "Kenya", disabled: true },
        ],
    },
    {
        value: "GHS_Mobile",
        label: "GHS Mobile Money",
        fields: [
            { name: "msisdn", label: "MSISDN Number", type: "text", placeholder: "Enter msisdn number" },
            { name: "MNO", label: "MNO", type: "text", placeholder: "Enter your MNO", defaultValue: "MTN", disabled: true },
            { name: "currency", label: "Currency", type: "text", placeholder: "Enter your currency code", defaultValue: "GHS", disabled: true },
            { name: "country", label: "Country", type: "text", placeholder: "Enter your country name", defaultValue: "Ghana", disabled: true },
        ],
    },
    {
        value: "KES_Mobile",
        label: "KES Mobile Money",
        fields: [
            { name: "msisdn", label: "MSISDN Number", type: "text", placeholder: "Enter msisdn number" },
            { name: "MNO", label: "MNO", type: "text", placeholder: "Enter your MNO", defaultValue: "MPESA", disabled: true },
            { name: "currency", label: "Currency", type: "text", placeholder: "Enter your currency code", defaultValue: "KES", disabled: true },
            { name: "country", label: "Country", type: "text", placeholder: "Enter your country name", defaultValue: "Kenya", disabled: true },
        ],
    },
    {
        value: "UGX_Mobile",
        label: "UGX Mobile Money",
        fields: [
            { name: "msisdn", label: "MSISDN Number", type: "text", placeholder: "Enter msisdn number" },
            { name: "MNO", label: "MNO", type: "text", placeholder: "Enter your MNO", defaultValue: "MTN", disabled: true },
            { name: "currency", label: "Currency", type: "text", placeholder: "Enter your currency code", defaultValue: "UGX", disabled: true },
            { name: "country", label: "Country", type: "text", placeholder: "Enter your country name", defaultValue: "Uganda", disabled: true },
        ],
    },
    {
        value: "RWF_Mobile",
        label: "RWF Mobile Money",
        fields: [
            { name: "msisdn", label: "MSISDN Number", type: "text", placeholder: "Enter msisdn number" },
            { name: "MNO", label: "MNO", type: "text", placeholder: "Enter your MNO", defaultValue: "MTN", disabled: true },
            { name: "currency", label: "Currency", type: "text", placeholder: "Enter your currency code", defaultValue: "RWF", disabled: true },
            { name: "country", label: "Country", type: "text", placeholder: "Enter your country name", defaultValue: "Rwanda", disabled: true },
        ],
    },
    {
        value: "ZMW_Mobile",
        label: "ZMW Mobile Money",
        fields: [
            { name: "msisdn", label: "MSISDN Number", type: "text", placeholder: "Enter msisdn number" },
            { name: "MNO", label: "MNO", type: "text", placeholder: "Enter your MNO", defaultValue: "zm_airtel", disabled: true },
            { name: "currency", label: "Currency", type: "text", placeholder: "Enter your currency code", defaultValue: "ZMW", disabled: true },
            { name: "country", label: "Country", type: "text", placeholder: "Enter your country name", defaultValue: "Zambia", disabled: true },
        ],
    },
    {
        value: "XOF_Mobile",
        label: "XOF Mobile Money",
        fields: [
            { name: "msisdn", label: "MSISDN Number", type: "text", placeholder: "Enter msisdn number" },
            { name: "MNO", label: "MNO", type: "text", placeholder: "Enter your MNO", defaultValue: "ORANGE_CI", disabled: true },
            { name: "currency", label: "Currency", type: "text", placeholder: "Enter your currency code", defaultValue: "XOF", disabled: true },
            { name: "country", label: "Country", type: "text", placeholder: "Enter your country name", defaultValue: "Côte d'Ivoire", disabled: true },
        ],
    },
    {
        value: "TZS_Mobile",
        label: "TZS Mobile Money",
        fields: [
            { name: "msisdn", label: "MSISDN Number", type: "text", placeholder: "Enter msisdn number" },
            { name: "MNO", label: "MNO", type: "text", placeholder: "Enter your MNO", defaultValue: "MTN", disabled: true },
            { name: "currency", label: "Currency", type: "text", placeholder: "Enter your currency code", defaultValue: "TZS", disabled: true },
            { name: "country", label: "Country", type: "text", placeholder: "Enter your country name", defaultValue: "Tanzania", disabled: true },
        ],
    },
];

export default function PayoutPage() {
    const [token, setToken] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [selectedMethod, setSelectedMethod] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true)
    const [heading, setHeading] = useState("")
    const [message, setMessage] = useState("")

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const t = params.get("token");
        setToken(t);
        getPayout(t)
    }, []);

    const getPayout = async (id) => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL}/commission/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
                    },
                }
            );
            if (response.data.payoutStatus == "Paid") {
                setHeading("Payout Completed")
                setMessage("Your payout has been successfully processed and the funds are now in your bank account.")
            }
            if (response.data.isPayout) {
                setHeading("Payout In Progress")
                setMessage("")
            }
            setLoading(false)
        } catch (error) {
            toast.error(error.response?.data?.error || error.message)
            console.error("Error submitting payout:", error.response?.data || error.message);
            setHeading("Contact Support")
            setLoading(false)
        }
    }

    const handleMethodChange = (e) => {
        const selected = paymentOptions.find((opt) => opt.value === e.target.value);
        setSelectedMethod(selected);

        // Initialize formData with defaults (so disabled values are included)
        const initialData = {};
        selected?.fields?.forEach((f) => {
            initialData[f.name] = f.defaultValue ?? "";
        });
        setFormData(initialData);
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = { reference: token, ...formData };

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BASE_URL}/commission/payout-request`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
                    },
                }
            );

            console.log("Payout submitted successfully:", response?.data);
            setHeading("Your Payout Is on the Way")
            setMessage("Your payout has been initiated and will reflect in your bank account within 2–5 business days.")
            setFormData({}); // reset form
            setSelectedMethod([]);
            toast.success(response?.data?.message || "Successful")
        } catch (error) {
            toast.error(error.response?.data?.error || error.message)
            console.error("Error submitting payout:", error.response?.data || error.message);
        }
    };


    return (
        <>
            <Head>
                <title>A Decentralized Marketplace for Artists and Artisans</title>
            </Head>
            <section>
                <Miniheader />
            </section>
            <section className="max-w-screen-xl mx-auto px-4 py-8 bg-orange-50">
                <div className="w-full">
                    <div className="">

                        {/* STATES */}
                        {loading ? (
                            /* Loading box */
                            <div className="py-10 md:py-16">
                                <h1 className="text-blue-950 text-3xl md:text-5xl xl:text-6xl text-center mb-4 font-bold leading-tight tracking-tight noto-font">

                                </h1>

                                <p className="max-w-2xl mx-auto text-blue-950 text-center text-sm xl:text-base font-medium mb-8 md:mb-12">
                                    Loading...
                                </p>
                            </div>
                        ) : heading ? (
                            /* Message screen (like Thank You) */
                            <div className="py-12 md:py-20 xl:py-30 px-4">
                                <h1 className={`text-blue-950 text-xl md:text-3xl xl:text-6xl text-center mb-3 noto-font`}>
                                    {heading}
                                </h1>

                                <p className="max-w-3xl mx-auto text-blue-950 text-center text-sm xl:text-base font-medium mb-8 md:mb-12">
                                    {message}
                                </p>
                            </div>
                        ) : token ? (
                            /* Payout form inside orange card */
                            <div className="max-w-lg md:max-w-2xl mx-auto">
                                <div className="bg-orange-100 p-5 md:p-8 rounded-md shadow">
                                    <h2 className="text-xl md:text-3xl text-blue-950 mb-6 md:mb-10 font-semibold text-center noto-font">
                                        Payout
                                    </h2>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* Payment Method Dropdown */}
                                        <div>
                                            <label
                                                htmlFor="paymentMethod"
                                                className="block text-sm font-medium text-blue-950 mb-2"
                                            >
                                                Payment Method
                                            </label>
                                            <select
                                                id="method"
                                                onChange={handleMethodChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                required
                                                defaultValue=""
                                            >
                                                <option value="" disabled>
                                                    Select method
                                                </option>
                                                {paymentOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Dynamic fields */}
                                        {selectedMethod?.fields?.map((field) => (
                                            <div key={field.name}>
                                                <label
                                                    htmlFor={field.name}
                                                    className="block text-sm font-medium text-blue-950 mb-2"
                                                >
                                                    {field.label}
                                                </label>
                                                <input
                                                    id={field.name}
                                                    type={field.type}
                                                    value={formData[field.name] ?? field.defaultValue ?? ""}
                                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                    placeholder={field.placeholder}
                                                    disabled={field.disabled}
                                                />
                                            </div>
                                        ))}

                                        <button
                                            type="submit"
                                            className="buttonprimary w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md shadow transition"
                                        >
                                            Get Paid
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            /* No token */
                            <div className="bg-red-100 rounded-md shadow p-6 md:p-10">
                                <p className="text-center text-red-600 text-base md:text-xl font-medium">
                                    No token found in URL.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section>
                <Footer />
            </section>
        </>
    );
}
