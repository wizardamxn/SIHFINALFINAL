import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);
async function convertAudioToText({ audioData }) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

  // Convert Buffer → base64
  const base64Audio = audioData.toString("base64");

  const result = await model.generateContent([
    {
      role: "user",
      parts: [
        { text: "Transcribe this audio into text:" },
        {
          inlineData: {
            mimeType: "audio/mp3", // adjust to your format
            data: base64Audio,
          },
        },
      ],
    },
  ]);

  return result.response.text();
}

export { convertAudioToText };
