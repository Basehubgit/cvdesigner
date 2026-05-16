import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const { extractText } = await import("unpdf");
    const { text } = await extractText(buffer, { mergePages: true });

    return NextResponse.json({ text });
  } catch (err) {
    console.error("PDF extraction error:", err);
    return NextResponse.json({ error: "Failed to extract PDF text" }, { status: 500 });
  }
}
