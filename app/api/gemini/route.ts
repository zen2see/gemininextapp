import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { prompt } = await request.json();

  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
  }

  const genAI = new GoogleGenerativeAI(API_KEY);

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return NextResponse.json({ text });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json({ error: 'Failed to get response from Gemini API' }, { status: 500 });
  }
}
