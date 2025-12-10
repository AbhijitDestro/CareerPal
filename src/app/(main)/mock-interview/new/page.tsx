"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Brain, Code, Activity, List } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createAssessment } from "@/actions/assessment";
import { toast } from "sonner";

export default function NewMockInterviewPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        topic: "",
        level: "Intermediate",
        numberOfQuestions: 5
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.topic.trim()) {
            toast.error("Please enter a topic");
            return;
        }

        setLoading(true);
        try {
            const assessment = await createAssessment({
                topic: formData.topic,
                level: formData.level,
                numberOfQuestions: formData.numberOfQuestions
            });
            
            toast.success("Interview generated successfully!");
            router.push(`/mock-interview/${assessment.id}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate interview. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full p-4 md:p-8 relative overflow-hidden">
             {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-orange-500/20 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-red-500/20 blur-[100px]" />
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
                 <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Link href="/mock-interview">
                        <Button variant="ghost" className="gap-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 pl-0 mb-4">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Interviews
                        </Button>
                    </Link>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Generation</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        New Mock Interview
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Customize your interview session to focus on specific topics and difficulty levels.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                     <Card className="border-0 shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
                        <CardHeader>
                            <CardTitle>Interview Settings</CardTitle>
                            <CardDescription>Configure the parameters for your practice session</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-2">
                                    <Label htmlFor="topic" className="text-base flex items-center gap-2">
                                        <Code className="h-4 w-4" />
                                        Topic / Tech Stack
                                    </Label>
                                    <Input 
                                        id="topic" 
                                        placeholder="e.g. React, System Design, Java, Management..." 
                                        value={formData.topic}
                                        onChange={(e) => setFormData({...formData, topic: e.target.value})}
                                        className="h-12 bg-white/50 dark:bg-gray-800/50"
                                        required
                                    />
                                    <p className="text-sm text-muted-foreground">Be specific for better results (e.g., "React Hooks" instead of just "React")</p>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-base flex items-center gap-2">
                                        <Activity className="h-4 w-4" />
                                        Difficulty Level
                                    </Label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {["Beginner", "Intermediate", "Advanced"].map((level) => (
                                            <div 
                                                key={level}
                                                className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${
                                                    formData.level === level 
                                                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 font-semibold shadow-md' 
                                                        : 'border-transparent bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }`}
                                                onClick={() => setFormData({...formData, level})}
                                            >
                                                {level}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label className="text-base flex items-center gap-2">
                                            <List className="h-4 w-4" />
                                            Number of Questions
                                        </Label>
                                        <span className="font-bold text-orange-600 dark:text-orange-400">{formData.numberOfQuestions}</span>
                                    </div>
                                    <div className="py-4 px-2">
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            step="1"
                                            value={formData.numberOfQuestions}
                                            onChange={(e) => setFormData({...formData, numberOfQuestions: parseInt(e.target.value)})}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-orange-500"
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs text-muted-foreground px-1">
                                        <span>1</span>
                                        <span>5</span>
                                        <span>10</span>
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full h-12 text-lg bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg shadow-orange-500/25"
                                >
                                    {loading ? (
                                        <>
                                            <Brain className="mr-2 h-5 w-5 animate-pulse" />
                                            Generating Interview...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-5 w-5" />
                                            Generate Interview
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}