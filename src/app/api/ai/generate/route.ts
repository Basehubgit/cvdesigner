import Replicate from "replicate";
import { NextRequest, NextResponse } from "next/server";
import { extractJsonObject, normalizeResumeData, REPLICATE_MODEL, replicateEventToText } from "@/lib/ai";

const SYSTEM_PROMPT = `You are an expert resume writer. Generate a complete, professional resume based on the given information.
Return ONLY a valid JSON object (no markdown, no explanation):
{
  "name": "First Last",
  "title": "",
  "email": "firstname.last@email.com",
  "phone": "+1 (555) 000-0000",
  "location": "City, Country",
  "linkedin": "",
  "website": "",
  "summary": "",
  "skills": [],
  "experience": [{"id":"1","role":"","company":"","location":"","period":"","description":""}],
  "education": [{"id":"1","degree":"","institution":"","year":"","gpa":""}],
  "certifications": []
}
Rules:
- Write a compelling 2-3 sentence professional summary
- Create 2-3 realistic work experience entries with strong action verbs and metrics
- Add 1-2 education entries
- Include 6-10 relevant skills as an array of strings
- Use realistic company names and dates
- Keep all content professional and ATS-friendly`;

export async function POST(req: NextRequest) {
  const { jobTitle, experience, skills } = await req.json() as {
    jobTitle: string;
    experience: string;
    skills: string;
  };

  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json({ error: "REPLICATE_API_TOKEN not configured" }, { status: 500 });
  }

  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

  const prompt = `Generate a complete resume for a ${jobTitle || "Professional"} with ${experience || "2-4"} years of experience.${skills ? ` Key skills to include: ${skills}.` : ""}`;

  let result = "";
  try {
    const output = await replicate.run(REPLICATE_MODEL, {
      input: {
        prompt,
        system_prompt: SYSTEM_PROMPT,
        max_tokens: 2048,
        temperature: 0.4,
      },
    });
    result = replicateEventToText(output);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown Replicate error";
    return NextResponse.json({ error: `AI provider error: ${message}` }, { status: 502 });
  }

  const jsonText = extractJsonObject(result);
  if (!jsonText) {
    return NextResponse.json({ error: "Failed to generate resume" }, { status: 500 });
  }

  try {
    return NextResponse.json(normalizeResumeData(JSON.parse(jsonText)));
  } catch {
    return NextResponse.json({ error: "Invalid response from AI" }, { status: 500 });
  }
}
