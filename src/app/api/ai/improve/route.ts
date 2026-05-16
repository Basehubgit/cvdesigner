import Replicate from "replicate";
import { NextRequest, NextResponse } from "next/server";
import { extractJsonObject, normalizeResumeData, REPLICATE_MODEL, replicateEventToText } from "@/lib/ai";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are an expert resume writer and career coach. You will receive resume text.
Your job is to:
1. Parse all information from the resume
2. Rewrite and IMPROVE the content to be more professional and impactful:
   - Use strong action verbs (Led, Built, Drove, Achieved, Optimized, etc.)
   - Add specific metrics and numbers where implied (e.g. "improved performance" → "improved performance by 40%")
   - Strengthen the professional summary to be compelling
   - Make bullet points concise and results-focused
   - Remove weak or vague language

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "name": "",
  "title": "",
  "email": "",
  "phone": "",
  "location": "",
  "linkedin": "",
  "website": "",
  "summary": "",
  "skills": [],
  "experience": [{"id":"1","role":"","company":"","location":"","period":"","description":""}],
  "education": [{"id":"1","degree":"","institution":"","year":"","gpa":""}],
  "certifications": []
}
Fill all fields you find. skills must be an array of strings. Return empty strings for missing fields.`;

export async function POST(req: NextRequest) {
  const { text } = await req.json() as { text: string };

  if (!text?.trim()) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json({ error: "REPLICATE_API_TOKEN not configured" }, { status: 500 });
  }

  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

  let result = "";
  try {
    const output = await replicate.run(REPLICATE_MODEL, {
      input: {
        prompt: `Parse and improve this resume:\n\n${text.slice(0, 4000)}`,
        system_prompt: SYSTEM_PROMPT,
        max_tokens: 2048,
        temperature: 0.3,
      },
    });
    result = replicateEventToText(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Replicate error";
    return NextResponse.json({ error: `AI provider error: ${message}` }, { status: 502 });
  }

  const jsonText = extractJsonObject(result);
  if (!jsonText) {
    return NextResponse.json({ error: "Could not process resume" }, { status: 500 });
  }

  try {
    return NextResponse.json(normalizeResumeData(JSON.parse(jsonText)));
  } catch {
    return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
  }
}
