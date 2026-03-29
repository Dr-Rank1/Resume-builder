import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  generateBulletPoints,
  improveText,
  suggestSkills,
  generateSummary,
  escapeUserInput,
} from "@/lib/ai";
import { db } from "@/lib/db";

// Rate limiting configuration
const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

// Simple in-memory rate limiting (use Redis for production)
const rateLimits = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = rateLimits.get(userId);

  if (!limit || now - limit.timestamp > RATE_LIMIT_WINDOW) {
    rateLimits.set(userId, { count: 1, timestamp: now });
    return true;
  }

  if (limit.count >= RATE_LIMIT) {
    return false;
  }

  limit.count++;
  return true;
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Check rate limit
  if (!checkRateLimit(session.user.id)) {
    return new NextResponse("Rate limit exceeded", { status: 429 });
  }

  const body = await request.json();
  const { type, data } = body;

  try {
    let result: unknown;

    switch (type) {
      case "generate-bullets": {
        const { jobTitle, company, jobDescription, responsibilities } = data;
        result = await generateBulletPoints(
          escapeUserInput(jobTitle),
          escapeUserInput(company),
          escapeUserInput(jobDescription),
          responsibilities.map(escapeUserInput)
        );
        break;
      }

      case "improve-text": {
        const { text } = data;
        result = await improveText(escapeUserInput(text));
        break;
      }

      case "suggest-skills": {
        const { jobTitle, industry, experienceLevel } = data;
        result = await suggestSkills(
          escapeUserInput(jobTitle),
          escapeUserInput(industry),
          escapeUserInput(experienceLevel)
        );
        break;
      }

      case "generate-summary": {
        const { name, jobTitle, yearsExperience, skills, careerGoals } = data;
        result = await generateSummary(
          escapeUserInput(name),
          escapeUserInput(jobTitle),
          yearsExperience,
          skills.map(escapeUserInput),
          escapeUserInput(careerGoals)
        );
        break;
      }

      default:
        return new NextResponse("Invalid type", { status: 400 });
    }

    // Track AI usage
    await db.aIUsage.create({
      data: {
        userId: session.user.id,
        type,
        input: JSON.stringify(data),
        output: JSON.stringify(result),
        tokens: 0, // Would need to track this from OpenAI response
        model: "gpt-4-turbo-preview",
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("AI error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}