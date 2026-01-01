import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";

const GenerateMetaTags = ({ values, setMeta, initialFormValues }) => {
  const [loadingGenerateMeta, setLoadingGenerateMeta] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const genAI = new GoogleGenerativeAI(
    "AIzaSyDnHI16kAmXR125FlgdFwws3d7sd758aX0"
  );

  const handleGenerateResponse = async () => {
    setLoadingGenerateMeta(true);
    setErrorMessage(""); // Clear any previous error messages
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
      });
      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 600,
        responseMimeType: "text/plain",
      };
      const chatSession = model.startChat({
        generationConfig,
      });
      const result = await chatSession.sendMessage(
        "Please create Meta Title, Meta Keywords and Meta Description Values for my product that i am adding for marketplace. I am giving you product name and product description. Remember i need just meta title meta keyword and then meta description noe please use that product Name: " +
          values.productName +
          " and product description: " +
          values.description +
          " i need response in json format. Please provide the output in plain text, without any JSON formatting or code block markers. Focus on creating tags that are compelling to users and improve SEO. "
      );
      setLoadingGenerateMeta(false);
      return result.response.text();
    } catch (error) {
      setLoadingGenerateMeta(false);
      console.error("Error generating description:", error);
      setErrorMessage("Failed to generate description. Please try again."); // Set error message
      return false;
    }
  };

  const isMetaDirty =
    values?.metaTitle !== initialFormValues?.metaTitle ||
    values?.metaDesc !== initialFormValues?.metaDesc ||
    values?.metaKeywords !== initialFormValues?.metaKeywords ||
    (!values?.metaTitle &&
      !initialFormValues?.metaTitle &&
      !values?.metaDesc &&
      !initialFormValues?.metaDesc &&
      !values?.metaKeywords &&
      !initialFormValues?.metaKeywords);

  return (
    <div className={`grid md:grid-cols-4 md:gap-6 gap-4 items-end`}>
      <div className="relative col-span-1">
        <button
          title="Generate Meta Tags"
          className="buttonprimary h-[50px]"
          style={{ borderRadius: "4px" }}
          disabled={
            !values ||
            (values && !values.productName) ||
            (values && !values.description) ||
            loadingGenerateMeta ||
            !isMetaDirty
          }
          onClick={async () => {
            const res = await handleGenerateResponse();
            if (res) {
              setMeta(JSON.parse(res));
            }
          }}
        >
          {loadingGenerateMeta ? "Loading..." : "Generate Meta"}
        </button>
      </div>
      <div className="relative col-span-2">
        {errorMessage && ( // Conditionally render error message
          <div className="text-red-500 text-sm mt-1">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default GenerateMetaTags;
