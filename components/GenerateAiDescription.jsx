import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";

const GenerateAiDescription = ({ defaultKeywords, setDescription }) => {
  const [loadingGenerateDescription, setLoadingGenerateDescription] =
    useState(false);
  const [keywords, setKeywords] = useState(defaultKeywords);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [isInputModified, setIsInputModified] = useState(false); // State to track if input is modified

  const genAI = new GoogleGenerativeAI(
    "AIzaSyDnHI16kAmXR125FlgdFwws3d7sd758aX0"
  );

  const handleGenerateResponse = async (productName) => {
    setLoadingGenerateDescription(true);
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
        "Please create some introduction text of my product. i am giving you some keywords name. Remember if there are more then 1 keywords it will b separated with comma. Also 6 to 7 lines of text no heading no bold and no line break need just simple text. Keywords: " +
          productName
      );
      setLoadingGenerateDescription(false);
      return result.response.text();
    } catch (error) {
      setLoadingGenerateDescription(false);
      console.error("Error generating description:", error);
      setErrorMessage("Failed to generate description. Please try again."); // Set error message
      return false;
    }
  };

  return (
    <div className={`grid md:grid-cols-4 md:gap-6 gap-4 items-end mt-4`}>
      <div className="relative col-span-2">
        <label htmlFor="productKeywords" style={{ marginBottom: 0 }}>
          Product Keywords
        </label>
        <i className="text-blue opacity-80 text-[12px]">
          keywords separated with comma
        </i>
        <input
          type="text"
          className="h-[50px]"
          name="productKeywords"
          onChange={(event) => {
            setKeywords(event.target.value);
            setIsInputModified(true); // Set input as modified when user types
          }}
          value={keywords}
          id="productKeywords"
          placeholder="Enter keywords to generate the product description"
        />
        {errorMessage && ( // Conditionally render error message
          <div className="text-red-500 text-sm mt-1">{errorMessage}</div>
        )}
      </div>
      <div className="relative col-span-1">
        <button
          title="Generate Product Description"
          className="buttonprimary h-[50px]"
          style={{ borderRadius: "4px" }}
          disabled={!keywords || loadingGenerateDescription || !isInputModified}
          onClick={async () => {
            const res = await handleGenerateResponse(keywords);
            if (res) {
              setDescription(res);
            }
          }}
        >
          {loadingGenerateDescription ? "Loading..." : "Generate"}
        </button>
      </div>
    </div>
  );
};

export default GenerateAiDescription;
