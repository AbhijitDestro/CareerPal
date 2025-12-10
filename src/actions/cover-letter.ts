"use server";

import { db } from "@/lib/drizzle/client";
import { coverLetter, user } from "@/lib/drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { randomUUID } from "crypto";

async function generateContentWithOpenRouter(prompt: string) {
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    throw new Error(
      "OPENROUTER_API_KEY is not configured. Please check your environment variables."
    );
  }

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://careerpal.app",
        "X-Title": "CareerPal Cover Letter Generator",
      },
      body: JSON.stringify({
        model: "meta-llama/llama-3.3-70b-instruct:free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("OpenRouter API error response:", errorText);
    console.error("Response status:", response.status);
    console.error("Response status text:", response.statusText);
    throw new Error(
      `OpenRouter API error (${response.status}): ${response.statusText}. Response: ${errorText}`
    );
  }

  const result = await response.json();
  return {
    response: { text: () => result.choices[0]?.message?.content || "" },
  };
}

export async function generateCoverLetter(data: {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Get user profile
  const userProfile = await db.query.user.findFirst({
    where: eq(user.id, (session.user as any).id),
  });

  if (!userProfile) {
    throw new Error("User not found");
  }

  const prompt = `
Write a professional cover letter for a ${data.jobTitle} position at ${
    data.companyName
  }.

About the candidate:
- Name: ${userProfile.name}
- Industry: ${userProfile.industryName || "Not specified"}
- Job Title: ${userProfile.jobTitle || "Not specified"}
- Years of Experience: ${userProfile.yearsOfExperience || "Not specified"}
- Skills: ${userProfile.keySkills?.join(", ") || "Not specified"}
- Professional Background: ${userProfile.bio || "Not specified"}

Job Description:
${data.jobDescription}

Requirements:
1. Use a professional, enthusiastic tone
2. Highlight relevant skills and experience from the candidate's profile
3. Show understanding of the company's needs based on the job description
4. Keep it concise (max 400 words)
5. Use proper business letter formatting in markdown
6. Include specific examples that relate to the candidate's background
7. Relate candidate's background to job requirements
8. Start with a proper greeting and end with a professional closing
9. Make it personalized and compelling

Format the letter in clean markdown without any code blocks or extra formatting.
`;

  try {
    const result = await generateContentWithOpenRouter(prompt);
    const content = result.response.text().trim();

    const [newCoverLetter] = await db
      .insert(coverLetter)
      .values({
        id: randomUUID(),
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: (session.user as any).id,
      })
      .returning();

    return newCoverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error);
    throw new Error("Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const letters = await db.query.coverLetter.findMany({
    where: eq(coverLetter.userId, (session.user as any).id),
    orderBy: [desc(coverLetter.createdAt)],
  });

  return letters;
}

export async function getCoverLetter(id: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const letter = await db.query.coverLetter.findFirst({
    where: and(eq(coverLetter.id, id), eq(coverLetter.userId, (session.user as any).id)),
  });

  return letter;
}

export async function deleteCoverLetter(id: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db
    .delete(coverLetter)
    .where(
      and(eq(coverLetter.id, id), eq(coverLetter.userId, (session.user as any).id))
    );

  return { success: true };
}

export async function updateCoverLetter(
  id: string,
  data: {
    jobTitle: string;
    companyName: string;
    jobDescription: string;
  }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Get user profile
  const userProfile = await db.query.user.findFirst({
    where: eq(user.id, (session.user as any).id),
  });

  if (!userProfile) {
    throw new Error("User not found");
  }

  const prompt = `
Write a professional cover letter for a ${data.jobTitle} position at ${
    data.companyName
  }.

About the candidate:
- Name: ${userProfile.name}
- Industry: ${userProfile.industryName || "Not specified"}
- Job Title: ${userProfile.jobTitle || "Not specified"}
- Years of Experience: ${userProfile.yearsOfExperience || "Not specified"}
- Skills: ${userProfile.keySkills?.join(", ") || "Not specified"}
- Professional Background: ${userProfile.bio || "Not specified"}

Job Description:
${data.jobDescription}

Requirements:
1. Use a professional, enthusiastic tone
2. Highlight relevant skills and experience from the candidate's profile
3. Show understanding of the company's needs based on the job description
4. Keep it concise (max 400 words)
5. Use proper business letter formatting in markdown
6. Include specific examples that relate to the candidate's background
7. Relate candidate's background to job requirements
8. Start with a proper greeting and end with a professional closing
9. Make it personalized and compelling

Format the letter in clean markdown without any code blocks or extra formatting.
`;

  try {
    const result = await generateContentWithOpenRouter(prompt);
    const content = result.response.text().trim();

    const [updatedLetter] = await db
      .update(coverLetter)
      .set({
        content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
      })
      .where(
        and(eq(coverLetter.id, id), eq(coverLetter.userId, (session.user as any).id))
      )
      .returning();

    return updatedLetter;
  } catch (error) {
    console.error("Error updating cover letter:", error);
    throw new Error("Failed to update cover letter");
  }
}