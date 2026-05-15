import Replicate from "replicate";
import { NextRequest, NextResponse } from "next/server";
import { extractJsonObject, normalizeResumeData, REPLICATE_MODEL, replicateEventToText } from "@/lib/ai";

const SYSTEM_PROMPT = `You are a resume parser. Extract structured data from the given resume or LinkedIn profile text.
Return ONLY a valid JSON object with this exact structure (no markdown, no explanation, just JSON):
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
Fill in all fields you can find. skills must be an array of strings. Return empty strings for missing fields.`;

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
        prompt: `Parse this into the JSON structure:\n\n${text.slice(0, 4000)}`,
        system_prompt: SYSTEM_PROMPT,
        max_tokens: 2048,
        temperature: 0.1,
      },
    });
    result = replicateEventToText(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Replicate error";
    return NextResponse.json({ error: `AI provider error: ${message}` }, { status: 502 });
  }

  const jsonText = extractJsonObject(result);
  if (!jsonText) {
    return NextResponse.json({ error: "Could not parse resume" }, { status: 500 });
  }

  try {
    return NextResponse.json(normalizeResumeData(JSON.parse(jsonText)));
  } catch {
    return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
  }
}
