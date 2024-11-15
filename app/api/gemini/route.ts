import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generationConfig = {
  topK: 40,
  topP: 0.95,
  temperature: 1,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain"
};

async function run(input: string) {
  const chatSession = model.startChat({ generationConfig, history: [] });

  const result = await chatSession.sendMessage(input);
  return result.response.text();
};

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ error: "Query cannot be empty!" }, { status: 400 });
    }
    const response = await run(query);
    return NextResponse.json({ answer: response });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred while calling the API!" }, { status: 500 });
  }
};