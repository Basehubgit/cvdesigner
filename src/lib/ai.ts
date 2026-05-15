export const REPLICATE_MODEL =
  (process.env.REPLICATE_MODEL ?? "meta/meta-llama-3-70b-instruct") as
    | `${string}/${string}`
    | `${string}/${string}:${string}`;

type ResumeData = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
  skills: string[];
  experience: Array<Record<string, unknown>>;
  education: Array<Record<string, unknown>>;
  certifications: Array<Record<string, unknown>>;
};

const EMPTY_RESUME_DATA: ResumeData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  website: "",
  summary: "",
  skills: [],
  experience: [],
  education: [],
  certifications: [],
};

export function replicateEventToText(event: unknown): string {
  if (typeof event === "string") return event;
  if (Array.isArray(event)) return event.map(replicateEventToText).join("");
  if (!event || typeof event !== "object") return String(event ?? "");

  const data = event as Record<string, unknown>;
  for (const key of ["data", "output", "text"]) {
    const value = data[key];
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return value.map(replicateEventToText).join("");
  }

  return "";
}

export function extractJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const char = text[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === "\"") {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (char === "{") depth++;
    if (char === "}") depth--;

    if (depth === 0) return text.slice(start, i + 1);
  }

  return null;
}

export function normalizeResumeData(input: unknown): ResumeData {
  const data = typeof input === "object" && input ? input as Record<string, unknown> : {};
  const now = Date.now();

  return {
    ...EMPTY_RESUME_DATA,
    ...data,
    skills: Array.isArray(data.skills) ? data.skills.map(String).filter(Boolean) : [],
    experience: Array.isArray(data.experience)
      ? data.experience.map((item, i) => ({
          ...(typeof item === "object" && item ? item as Record<string, unknown> : {}),
          id: String(now + i),
        }))
      : [],
    education: Array.isArray(data.education)
      ? data.education.map((item, i) => ({
          ...(typeof item === "object" && item ? item as Record<string, unknown> : {}),
          id: String(now + i + 100),
        }))
      : [],
    certifications: Array.isArray(data.certifications)
      ? data.certifications.map((item, i) => ({
          ...(typeof item === "object" && item ? item as Record<string, unknown> : {}),
          id: String(now + i + 200),
        }))
      : [],
  };
}
