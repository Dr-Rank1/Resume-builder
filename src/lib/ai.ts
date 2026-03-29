import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateBulletPoints(
  jobTitle: string,
  company: string,
  jobDescription: string,
  responsibilities: string[]
): Promise<string[]> {
  const prompt = `Generate 3-5 impactful bullet points for a ${jobTitle} position at ${company}.
Focus on:
- Quantifiable achievements
- Action verbs
- Industry keywords

Job Description:
${jobDescription}

Current Responsibilities:
${responsibilities.join("\n")}

Output as a JSON array of strings.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content:
          "You are a professional resume writer. Generate impactful bullet points that quantify achievements.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Failed to generate bullet points");
  }

  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : parsed.bullets || [];
  } catch {
    return [];
  }
}

export async function improveText(originalText: string): Promise<string> {
  const prompt = `Improve the following resume text for professionalism and impact.
Keep it concise, use action verbs, and quantify achievements where possible.

Original Text:
${originalText}

Provide the improved version.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content:
          "You are a professional resume writer. Improve text to be more impactful and professional.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || originalText;
}

export async function suggestSkills(
  jobTitle: string,
  industry: string,
  experienceLevel: string
): Promise<{ technical: string[]; soft: string[] }> {
  const prompt = `Based on the following job title and experience, suggest relevant technical and soft skills.

Job Title: ${jobTitle}
Industry: ${industry}
Experience Level: ${experienceLevel}

Provide a JSON object with 'technical' and 'soft' arrays of skills.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content:
          "You are a career advisor. Suggest relevant skills based on job titles and experience levels.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    return { technical: [], soft: [] };
  }

  try {
    return JSON.parse(content);
  } catch {
    return { technical: [], soft: [] };
  }
}

export async function generateSummary(
  name: string,
  jobTitle: string,
  yearsExperience: number,
  skills: string[],
  careerGoals: string
): Promise<string> {
  const prompt = `Generate a professional summary for a resume.

Details:
- Name: ${name}
- Job Title: ${jobTitle}
- Years of Experience: ${yearsExperience}
- Key Skills: ${skills.join(", ")}
- Career Goals: ${careerGoals}

Keep it under 100 words and impactful.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content:
          "You are a professional resume writer. Generate compelling career summaries.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "";
}

// Helper to escape user input to prevent prompt injection
export function escapeUserInput(input: string): string {
  return input
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}