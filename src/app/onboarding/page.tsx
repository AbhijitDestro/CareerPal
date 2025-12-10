import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/drizzle/client";
import { user } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import OnboardingForm from "./_component/onboarding-form";

export default async function Onboarding() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/sign-in");
    }

    const [existingUser] = await db.select().from(user).where(eq(user.email, session.user.email!));

    if (existingUser?.jobTitle) {
        redirect("/dashboard");
    }

    return <OnboardingForm />;
}