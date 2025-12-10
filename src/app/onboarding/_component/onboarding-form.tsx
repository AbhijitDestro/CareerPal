"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, X, Upload } from "lucide-react";
import { saveOnboardingData } from "./actions";

export default function OnboardingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData(event.currentTarget);
        
        try {
            const file = formData.get("image") as File;
            if (file && file.size > 0 && file.name !== "") {
                 const base64Image = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
                formData.set("image", base64Image);
            } else {
                 // Remove empty file object if no file selected, so it doesn't overwrite with "[object File]" or similar if logic is loose
                 formData.delete("image");
            }

            await saveOnboardingData(formData);
        } catch (error) {
            console.error("Onboarding error:", error);
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black text-white">
             {/* Background Effects */}
             <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
            >
                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Welcome to CareerPal</h1>
                        <p className="text-zinc-400">
                            Let's set up your profile to personalize your experience.
                        </p>
                    </div>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="text-zinc-400 hover:text-white transition-colors"
                        type="button"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="image" className="text-sm font-medium text-zinc-300">
                                Profile Image
                            </label>
                            <div className="relative">
                                <input
                                    id="image"
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                />
                                <label 
                                    htmlFor="image" 
                                    className="flex items-center justify-center w-full h-10 px-3 rounded-md bg-black/50 border border-white/10 text-zinc-400 cursor-pointer hover:bg-zinc-800 transition-colors"
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Photo
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="jobTitle" className="text-sm font-medium text-zinc-300">
                                Job Title *
                            </label>
                            <input
                                required
                                id="jobTitle"
                                name="jobTitle"
                                type="text"
                                placeholder="Software Engineer"
                                className="w-full h-10 px-3 rounded-md bg-black/50 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="companyName" className="text-sm font-medium text-zinc-300">
                                Company Name
                            </label>
                            <input
                                id="companyName"
                                name="companyName"
                                type="text"
                                placeholder="Acme Inc"
                                className="w-full h-10 px-3 rounded-md bg-black/50 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="industryName" className="text-sm font-medium text-zinc-300">
                                Industry
                            </label>
                            <input
                                id="industryName"
                                name="industryName"
                                type="text"
                                placeholder="Technology"
                                className="w-full h-10 px-3 rounded-md bg-black/50 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>

                         <div className="space-y-2">
                            <label htmlFor="yearsOfExperience" className="text-sm font-medium text-zinc-300">
                                Years of Experience
                            </label>
                            <input
                                id="yearsOfExperience"
                                name="yearsOfExperience"
                                type="number"
                                min="0"
                                placeholder="5"
                                className="w-full h-10 px-3 rounded-md bg-black/50 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                         <label htmlFor="keySkills" className="text-sm font-medium text-zinc-300">
                            Key Skills (comma separated)
                        </label>
                        <input
                            id="keySkills"
                            name="keySkills"
                            type="text"
                            placeholder="React, Node.js, TypeScript"
                            className="w-full h-10 px-3 rounded-md bg-black/50 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="bio" className="text-sm font-medium text-zinc-300">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            rows={3}
                            placeholder="Tell us a bit about yourself..."
                            className="w-full p-3 rounded-md bg-black/50 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 bg-white text-black font-medium rounded-md hover:bg-zinc-200 transition-colors flex items-center justify-center mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            "Saving..."
                        ) : (
                            <>
                                Complete Profile <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}