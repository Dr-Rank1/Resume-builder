import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const resumes = await db.resume.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      sections: true,
    },
  });

  return NextResponse.json(resumes);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { title } = body;

  if (!title) {
    return new NextResponse("Title is required", { status: 400 });
  }

  const slug = slugify(title);

  // Check if slug exists
  const existing = await db.resume.findUnique({
    where: { slug },
  });

  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const resume = await db.resume.create({
    data: {
      title,
      slug: finalSlug,
      userId: session.user.id,
      sections: {
        create: [
          { type: "personal", title: "Personal Information", content: {}, order: 0 },
          { type: "summary", title: "Professional Summary", content: {}, order: 1 },
          { type: "experience", title: "Work Experience", content: {}, order: 2 },
          { type: "education", title: "Education", content: {}, order: 3 },
          { type: "skills", title: "Skills", content: {}, order: 4 },
          { type: "projects", title: "Projects", content: {}, order: 5 },
          { type: "certifications", title: "Certifications", content: {}, order: 6 },
        ],
      },
    },
    include: {
      sections: true,
    },
  });

  return NextResponse.json(resume);
}