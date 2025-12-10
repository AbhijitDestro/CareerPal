"use server";
import { db } from "@/lib/drizzle/client";
import { user } from "@/lib/drizzle/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) {
    return { error: "Missing required fields" };
  }

  // Check if user exists
  const [existingUser] = await db.select().from(user).where(eq(user.email, email));
  if (existingUser) {
    return { error: "User already exists" };
  }

  const hashedPassword = await hash(password, 10);

  try {
    await db.insert(user).values({
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      emailVerified: false, 
    });
    return { success: true };
  } catch (e) {
    console.error("Registration error:", e);
    return { error: "Failed to create user" };
  }
}
