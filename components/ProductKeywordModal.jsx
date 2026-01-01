import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const ProductKeywordModal = ({
  hrefLink,
  isOpen,
  onClose,
  onConfirm,
  onSkip,
}) => {
  if (!isOpen || !hrefLink) return null;

  const validationSchema = Yup.object().shape({
    keywords: Yup.string()
      .trim()
      .required("Keywords are required.")
      .matches(
        /^[a-zA-Z0-9\-%#@!&\s]+(, [a-zA-Z0-9\-%#@!&\s]+)*$/,
        "Keywords must be comma-separated with space after each comma."
      ),
  });

  const handleSubmit = (values) => {
    const data = { ...values };
    onConfirm(data);
    onClose();
  };

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-[9999]">
      <div className="bg-orange-50 rounded-lg p-6 shadow-lg max-w-2xl w-full relative max-h-full overflow-scroll">
        {/* Close Button */}
        <button
          className="absolute top-[1.7rem] right-[1.5rem] text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          Product Keywords
        </h2>
        <p className="text-gray-600 mb-2 text-[13px]">
          Enter clear, relevant keywords to let our AI craft compelling titles,
          descriptions, and metadata for a seamless upload.
        </p>
        <p className="text-gray-600 mb-2 text-[13px]">
          Use specific keywords related to the below to enhance visibility:
        </p>
        <ol className="mb-2 px-4 text-[13px]">
          <li>
            <b>Product Type</b> (e.g., Ankara Shirt, Leather Bag).
          </li>
          <li>
            <b>Key Features</b> (e.g., Handmade, Lightweight).
          </li>
          <li>
            <b>Material</b> (e.g., Cotton, Wood).
          </li>
          <li>
            <b>Target Audience</b> (e.g., Men, Women, Kids).
          </li>
          <li>
            <b>Occasion</b> (e.g., Casual, Wedding, Office).
          </li>
          <li>
            <b>Benefits</b> (e.g., Comfortable Fit, Durable, Eco-friendly).
          </li>
        </ol>
        <p className="text-gray-600 mb-4 text-[13px]">
          Well-chosen keywords ensure your product stands out and attracts the
          right customers!
        </p>
        <Formik
          initialValues={{
            hrefLink,
            keywords: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched, isValid }) => (
            <Form>
              <div className="mb-4">
                <label className="mb-1 font-medium text-gray-700 flex items-center relative">
                  Keywords <span className="text-red-500">*</span>
                </label>
                <Field
                  as="textarea"
                  name="keywords"
                  className={`bg-gray-100 border min-h-[80px] w-full text-sm font-medium text-gray-700 p-3.5 rounded focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.keywords && touched.keywords
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="e.g., organic candles, knitted scarf, ceramic mug"
                />
                {errors.keywords && touched.keywords && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.keywords}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-gray-600 px-4 py-2 rounded hover:text-gray-800 transition"
                  onClick={onSkip}
                >
                  Skip
                </button>
                <button
                  type="submit"
                  className={`bg-primary text-white px-4 py-2 rounded ml-2 transition ${
                    !isValid || isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary-dark"
                  }`}
                  disabled={!isValid || isSubmitting}
                >
                  Submit
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProductKeywordModal;
