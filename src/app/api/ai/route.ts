import Replicate from "replicate";
import { NextRequest } from "next/server";
import { REPLICATE_MODEL, replicateEventToText } from "@/lib/ai";

const SYSTEM_PROMPTS: Record<string, string> = {
  chat: `You are an expert resume writing assistant. Help users craft professional, ATS-optimized resumes.
Be concise but detailed. Use bullet points when listing items.
When improving content, show before/after comparisons.
Always focus on quantifiable achievements and strong action verbs.`,

  improve_summary: `You are an expert resume editor. Rewrite the professional summary to be more impactful.
Rules: Start with years of experience and role. Include 1-2 quantifiable achievements. End with a value proposition.
Keep it to 3-4 sentences. Use strong action verbs. Respond with ONLY the improved summary text, no explanations.`,

  improve_bullet: `You are an expert resume editor. Rewrite this work experience description using the STAR method.
Rules: Use strong action verbs. Add metrics/numbers where possible. Be specific about impact.
Keep it to 2-3 sentences. Respond with ONLY the improved description, no explanations.`,

  suggest_skills: `You are a career expert. Based on the job title provided, suggest 5 relevant technical and soft skills.
Rules: Return ONLY a comma-separated list of skills, nothing else. Example: React, TypeScript, Node.js, Problem Solving, Agile`,
};

export async function POST(req: NextRequest) {
  const { message, type = "chat" } = await req.json() as { message: string; type?: string };

  if (!process.env.REPLICATE_API_TOKEN) {
    return new Response(
      JSON.stringify({ error: "REPLICATE_API_TOKEN is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

  let result = "";
  try {
    const output = await replicate.run(REPLICATE_MODEL, {
      input: {
        prompt: message,
        system_prompt: SYSTEM_PROMPTS[type] ?? SYSTEM_PROMPTS.chat,
        max_tokens: 1024,
        temperature: 0.7,
        top_p: 0.9,
      },
    });
    result = replicateEventToText(output);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    result = `[Error: ${msg}]`;
  }

  return new Response(result, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
