export function calcAtsScore(formData: Record<string, unknown>): number {
  let score = 0;
  const f = formData as Record<string, unknown>;

  if (f.name)     score += 10;
  if (f.title)    score += 10;
  if (f.email)    score += 8;
  if (f.phone)    score += 5;
  if (f.location) score += 5;
  if (f.linkedin) score += 4;

  const summary = f.summary as string | undefined;
  if (summary && summary.length > 80)  score += 15;
  else if (summary && summary.length > 30) score += 8;

  const exp = f.experience as unknown[] | undefined;
  if (exp && exp.length >= 1) score += 15;
  if (exp && exp.length >= 2) score += 5;

  const edu = f.education as unknown[] | undefined;
  if (edu && edu.length >= 1) score += 10;

  const skills = f.skills as string[] | undefined;
  if (skills && skills.length >= 3) score += 8;
  if (skills && skills.length >= 6) score += 5;

  return Math.min(score, 100);
}
