"use server";

import { db } from "@/lib/drizzle/client";
import { user } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function saveOnboardingData(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const image = formData.get("image") as string;
  const jobTitle = formData.get("jobTitle") as string;
  const companyName = formData.get("companyName") as string;
  const industryName = formData.get("industryName") as string;
  const yearsOfExperience = formData.get("yearsOfExperience")
    ? parseInt(formData.get("yearsOfExperience") as string)
    : 0;
  const keySkillsString = formData.get("keySkills") as string;
  const bio = formData.get("bio") as string;

  const keySkills = keySkillsString
    ? keySkillsString.split(",").map((s) => s.trim())
    : [];

  const updateData: Partial<typeof user.$inferInsert> = {};
  if (image) updateData.image = image;
  if (jobTitle) updateData.jobTitle = jobTitle;
  if (companyName) updateData.companyName = companyName;
  if (industryName) updateData.industryName = industryName;
  if (yearsOfExperience !== undefined) updateData.yearsOfExperience = yearsOfExperience;
  if (keySkills.length > 0) updateData.keySkills = keySkills;
  if (bio) updateData.bio = bio;

  await db.update(user).set(updateData).where(eq(user.id, (session.user as any).id));

  redirect("/dashboard");
}
