import Link from "next/link";

const SignInPromptModal = ({ isOpen, onClose, handleContinue, loading, rateOptionsError }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-4">
      <div className="bg-orange-50 p-6 rounded-lg shadow-xl max-w-md w-full relative text-center">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* <h1 className={`text-blue-950 text-3xl font-semibold mb-4 noto-font`}>
          You need to sign in first
        </h1> */}
        <p className="text-gray-700 mb-6">
          To access your cart and continue with checkout, please sign in or proceed as a guest.
        </p>

        {/* Sign In */}
        <div className="flex justify-center mb-4">
          <Link
            href="/sign-in?redirect=/cart"
            className="buttonprimary px-6 py-2 rounded inline-flex items-center justify-center  text-white gap-2  transition-all duration-200"
          >
            Sign In or Register
          </Link>
        </div>

        {/* OR Divider */}
        <div className="relative my-4">
          <div className="border-t border-gray-300 w-full"></div>
          <span className="absolute top-[-12px] left-1/2 -translate-x-1/2 bg-orange-50 px-3 text-gray-500 text-sm">
            OR
          </span>
        </div>

        {/* Continue as Guest */}
        <button
          onClick={handleContinue}
          disabled={loading || rateOptionsError}
          className={`w-full buttonprimary px-6 py-2 rounded flex items-center justify-center text-white transition-all duration-200 ${
            loading || rateOptionsError ? "pointer-events-none opacity-50" : ""
          }`}
        >
          {loading ? "Loading..." : "Continue as Guest"}
        </button>

        <p className="text-xs text-gray-500 mt-3">
          You'll be able to checkout without creating an account.
        </p>
      </div>
    </div>
  );
};

export default SignInPromptModal;
