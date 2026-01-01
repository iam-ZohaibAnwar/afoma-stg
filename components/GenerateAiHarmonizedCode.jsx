import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";

const GenerateAiHarmonizedCode = ({
  productTitle,
  productDesc,
  commodityCode,
  initialFormValues,
  setHarmonizedCode,
}) => {
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const genAI = new GoogleGenerativeAI(
    "AIzaSyDnHI16kAmXR125FlgdFwws3d7sd758aX0"
  );

  const handleGenerateResponse = async () => {
    setLoadingGenerate(true);
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
        `Generated HS Code using Product Title: ${productTitle} and Product Description: ${productDesc} Also just give me code string no other text or explanation please give correct and standard one with no dots`
      );
      setLoadingGenerate(false);
      return result.response.text();
    } catch (error) {
      setLoadingGenerate(false);
      return false;
    }
  };

  const isDirty =
    commodityCode !== initialFormValues?.commodityCode ||
    (!commodityCode && !initialFormValues?.commodityCode);

  return (
    <button
      title="Generate Harmonized Code"
      className="text-white text-[12px]  bg-primary px-2 py-1.5 rounded cursor-pointer disabled:opacity-40"
      disabled={!productDesc || !productDesc || loadingGenerate || !isDirty}
      onClick={async () => {
        const res = await handleGenerateResponse();
        setHarmonizedCode(res.trim() || "");
      }}
    >
      {loadingGenerate ? "Loading..." : "Generate Code"}
    </button>
  );
};
export default GenerateAiHarmonizedCode;
