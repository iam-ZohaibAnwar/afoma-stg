import { GoogleGenerativeAI } from "@google/generative-ai";

export const getPrePopulatedAIProductData = async (keywordQuery) => {
  if (!keywordQuery) return undefined;
  try {
    const genAI = new GoogleGenerativeAI(
      "AIzaSyDnHI16kAmXR125FlgdFwws3d7sd758aX0"
    );
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
      `Generate a Product Title, Product Description, Meta Title, Meta Keyword and Meta Description for a marketplace using the keywords: ${keywordQuery}. i need response in json format. Please provide the output in plain text, without any JSON formatting or code block markers.`
    );
    const hsCode = await chatSession.sendMessage(
      `Generate a Harmonized System Code for a product using the keywords: ${keywordQuery}. Ensure this is accurately captures the right 6 to 10 digit code. And i need just code no other text and it make sure it's not in decimal.`
    );
 
    return {
      hsCode: hsCode.response.text(),
      ...JSON.parse(result.response.text())
    };
  } catch (error) {
    return undefined;
  }
};
