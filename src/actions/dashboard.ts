"use server";

import { db } from "@/lib/drizzle/client";
import {
  resume,
  coverLetter,
  assessment,
  industryInsight,
  user,
} from "@/lib/drizzle/schema";
import { eq, avg, max, count } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getDashboardStats() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Get resume analysis count
  const resumeCountResult = await db
    .select({ count: count() })
    .from(resume)
    .where(eq(resume.userId, (session.user as any).id));
  const resumeCount = resumeCountResult[0].count;

  // Get cover letter count
  const coverLetterCountResult = await db
    .select({ count: count() })
    .from(coverLetter)
    .where(eq(coverLetter.userId, (session.user as any).id));
  const coverLetterCount = coverLetterCountResult[0].count;

  // Get interview (assessment) count
  const interviewCountResult = await db
    .select({ count: count() })
    .from(assessment)
    .where(eq(assessment.userId, (session.user as any).id));
  const interviewCount = interviewCountResult[0].count;

  // Get average and highest scores from completed assessments
  const scoreResults = await db
    .select({
      avgScore: avg(assessment.quizScore),
      maxScore: max(assessment.quizScore),
    })
    .from(assessment)
    .where(eq(assessment.userId, (session.user as any).id));

  const avgScore = scoreResults[0].avgScore
    ? Number(parseFloat(scoreResults[0].avgScore.toString()).toFixed(1))
    : 0;
  const maxScore = scoreResults[0].maxScore
    ? Number(parseFloat(scoreResults[0].maxScore.toString()).toFixed(1))
    : 0;

  // Get user's industry insight
  const userData = await db.query.user.findFirst({
    where: eq(user.id, (session.user as any).id),
  });

  let lastUpdated = null;
  if (userData?.industryName) {
    const insight = await db.query.industryInsight.findFirst({
      where: eq(industryInsight.userId, (session.user as any).id),
    });

    if (insight) {
      lastUpdated = insight.lastUpdated;
    }
  }

  return {
    resumeAnalyzed: resumeCount,
    coverLettersCreated: coverLetterCount,
    interviewsTaken: interviewCount,
    averageScore: avgScore,
    highestScore: maxScore,
    lastIndustryInsightUpdate: lastUpdated,
  };
}