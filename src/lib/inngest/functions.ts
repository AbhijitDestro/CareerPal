import { db } from "@/lib/drizzle/client";
import { inngest } from "./client";
import { industryInsight, user } from "@/lib/drizzle/schema";
import { eq, isNotNull } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { randomUUID } from "crypto";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Validate that the API key is set
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables!");
  throw new Error(
    "GEMINI_API_KEY is not configured. Please check your environment variables."
  );
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function generateAIInsights(industry: string, jobTitle?: string) {
  const jobContext = jobTitle
    ? ` with specific focus on ${jobTitle} roles`
    : "";

  const prompt = `
You are a career insights analyst specializing in the Indian job market. Analyze the ${industry} industry${jobContext} in India and provide REALISTIC, ACCURATE market data.

CRITICAL SALARY GUIDELINES:
- Medical professionals (doctors, surgeons): ₹20,00,000 - ₹1,00,00,000+ per annum
- Senior specialists/consultants: ₹50,00,000 - ₹2,00,00,000+ per annum
- Technology professionals: ₹8,00,000 - ₹50,00,000+ per annum
- Management roles: ₹15,00,000 - ₹80,00,000+ per annum
- Entry-level professionals: ₹3,00,000 - ₹8,00,000 per annum

Provide insights in ONLY this JSON format (no additional text):
{
  "salaryRanges": [
    { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
  ],
  "growthRate": number,
  "demandLevel": "High" | "Medium" | "Low",
  "topSkills": ["skill1", "skill2"],
  "marketOutlook": "Positive" | "Neutral" | "Negative",
  "keyTrends": ["trend1", "trend2"],
  "recommendedSkills": ["skill1", "skill2"]
}

STRICT REQUIREMENTS:
1. All salary values in Indian Rupees (INR) per annum - use REALISTIC numbers based on actual Indian market rates
2. For ${industry}${jobContext}, research and provide ACCURATE salary ranges (don't underestimate!)
3. Include 5-7 relevant roles with their actual market salaries in major Indian cities (Mumbai, Delhi, Bangalore, Chennai, Hyderabad)
4. Growth rate as percentage (realistic industry growth in India)
5. Include 5-7 skills and trends SPECIFIC to ${industry}${jobContext} - NOT generic tech skills unless this is a technology role
6. Top skills and recommended skills must be directly relevant to ${industry}${jobContext}
7. Consider experience levels: Junior (0-3 years), Mid (3-7 years), Senior (7-15 years), Expert (15+ years)

EXAMPLE for a surgeon:
- Junior Surgeon: ₹20,00,000 - ₹35,00,000
- Senior Surgeon: ₹50,00,000 - ₹1,00,00,000
- Consultant Surgeon: ₹80,00,000 - ₹2,00,00,000+

Return ONLY valid JSON. No markdown, no explanations.
`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

  return JSON.parse(cleanedText);
}

// Inngest Cron Job for automated weekly updates
export const generateIndustryInsights = inngest.createFunction(
  {
    id: "generate-industry-insights",
    name: "Generate Industry Insights",
  },
  { cron: "0 0 * * 0" }, // Run every Sunday at midnight
  async ({ event, step }) => {
    // Fetch all users who have industry information
    const usersWithIndustries = await step.run("Fetch users with industries", async () => {
      return await db
        .select({
          id: user.id,
          industryName: user.industryName,
          jobTitle: user.jobTitle
        })
        .from(user)
        .where(isNotNull(user.industryName));
    });

    // Process each user's industry insights
    for (const userProfile of usersWithIndustries) {
      // Skip if industryName is null (shouldn't happen due to where clause, but for type safety)
      if (!userProfile.industryName) continue;
      
      await step.run(`Update insights for user ${userProfile.id}`, async () => {
        // Generate insights using Gemini based on user's industry and job title
        const insights = await generateAIInsights(
          userProfile.industryName!,
          userProfile.jobTitle || undefined
        );

        // Check if user already has insights
        const existingInsights = await db.query.industryInsight.findFirst({
          where: eq(industryInsight.userId, userProfile.id),
        });

        if (existingInsights) {
          // Update existing insights
          await db
            .update(industryInsight)
            .set({
              industry: userProfile.industryName!,
              salaryRanges: insights.salaryRanges,
              growthRate: insights.growthRate,
              demandLevel: insights.demandLevel,
              topSkills: insights.topSkills,
              marketOutlook: insights.marketOutlook,
              keyTrends: insights.keyTrends,
              recommendedSkills: insights.recommendedSkills,
              lastUpdated: new Date(),
              nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            })
            .where(eq(industryInsight.userId, userProfile.id));
        } else {
          // Insert new insights for the user
          await db.insert(industryInsight).values({
            id: randomUUID(),
            userId: userProfile.id,
            industry: userProfile.industryName!,
            ...insights,
            lastUpdated: new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
        }
      });
    }
  }
);