import { useRouter } from "next/router";
import React, { useState } from "react";

const Waitlist = () => {
  const router = useRouter();
  const [email, setEmail] = useState();
  const [showSuccessMessage, setShowSuccessMessage] = useState();
  const [showFailureMessage, setShowFailureMessage] = useState();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/subscription`, {
      body: JSON.stringify({
        email: email,
      }),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "gCV_WZOz9nIa8QwTyEFvccQmIK94Ufxm",
      },
      method: "POST",
    });

    const { error } = await res.json();

    if (error) {
      //
      setShowSuccessMessage(false);
      setShowFailureMessage(true);

      setEmail("");
      setLoading(false);
    }

    if (res.status === 200) {
      //
      setShowSuccessMessage(true);
      setShowFailureMessage(false);
      // Reset form fields
      setEmail("");
      setLoading(false);
    }
  };
  return (
    <section>
      <div className="mb-4">
        <form
          className="flex flex-col w-full gap-4 xl:flex-row"
          onSubmit={handleSubmit}
          method="POST"
        >
          <input
            type="email"
            name="email"
            value={email}
            data-aos="fade-up"
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            required
            placeholder="Enter your email address"
            className="placeholder:text-slate-600 text-sm text-gray-700 border border-slate-200 rounded w-80 px-5 py-4"
          />
          <button
            type="submit"
            className={`py-4 px-10 text-sm bg-primary rounded text-white font-bold cursor-pointer text-center hover:bg-primaryHover transition-colors ease-in inline-flex items-center justify-center disabled:cursor-progress disabled:hover:bg-primary disabled:opacity-50`}
            disabled={loading}
          >
            Subscribe Now{" "}
            {loading && (
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-slate-200 animate-spin fill-white ml-2"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
          </button>
        </form>
        <div className="mx-auto">
          {showSuccessMessage ? (
            <p className="text-green-500 font-semibold text-sm my-5 text-center">
              You're in! Welcome to the AFOMA Community.
            </p>
          ) : (
            <p className="text-green-500 font-semibold text-sm my-5 text-center"></p>
          )}
          {showFailureMessage ? (
            <p className="text-red-500 font-semibold text-sm my-5 text-center">
              Oops! Something went wrong, please try again.
            </p>
          ) : (
            <p className="text-red-500 font-semibold text-sm my-5 text-center"></p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Waitlist;
