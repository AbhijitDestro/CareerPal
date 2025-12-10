"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAssessment } from "@/actions/assessment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowLeft, Trophy, Lightbulb, Target } from "lucide-react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import confetti from "canvas-confetti";

export default function InterviewFeedbackPage() {
    const params = useParams();
    const router = useRouter();
    const [assessment, setAssessment] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                const data = await getAssessment(params.id as string);
                if (!data) {
                    router.push("/mock-interview");
                    return;
                }
                setAssessment(data);
                
                // Fire confetti if score is high
                if (data.quizScore && data.quizScore >= 70) {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
            } catch (error) {
                console.error("Failed to load feedback:", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchAssessment();
        }
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!assessment) return null;

    return (
        <div className="min-h-screen w-full p-4 md:p-8 relative overflow-hidden">
             {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-green-500/10 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <Link href="/mock-interview">
                        <Button variant="ghost" className="gap-2 pl-0">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Interviews
                        </Button>
                    </Link>
                    <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(assessment.createdAt), { addSuffix: true })}
                    </span>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                     {/* Score Card */}
                    <Card className="col-span-1 md:col-span-1 border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 flex flex-col items-center justify-center text-center p-6">
                        <div className="relative mb-4">
                            <svg className="h-32 w-32 transform -rotate-90">
                                <circle
                                    className="text-gray-200 dark:text-gray-700"
                                    strokeWidth="8"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="58"
                                    cx="64"
                                    cy="64"
                                />
                                <circle
                                    className={`${assessment.quizScore >= 70 ? 'text-green-500' : assessment.quizScore >= 40 ? 'text-yellow-500' : 'text-red-500'}`}
                                    strokeWidth="8"
                                    strokeDasharray={360}
                                    strokeDashoffset={360 - (360 * assessment.quizScore) / 100}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="58"
                                    cx="64"
                                    cy="64"
                                />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold">
                                {assessment.quizScore?.toFixed(0)}%
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-1">Overall Score</h3>
                        <p className="text-sm text-muted-foreground">
                            {assessment.quizScore >= 70 ? "Excellent work!" : assessment.quizScore >= 40 ? "Good effort!" : "Keep practicing!"}
                        </p>
                    </Card>

                    {/* Feedback Card */}
                    <Card className="col-span-1 md:col-span-2 border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-yellow-500" />
                                AI Feedback
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="p-4 rounded-lg bg-yellow-500/10 text-yellow-800 dark:text-yellow-200 border border-yellow-500/20">
                                <p className="text-lg italic">"{assessment.improvementTip}"</p>
                            </div>
                            <div className="mt-6 flex gap-4">
                                <div className="flex items-center gap-2">
                                    <Target className="h-4 w-4 text-blue-500" />
                                    <span className="text-sm font-medium">{assessment.level} Level</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Trophy className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm font-medium">{assessment.topic}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="space-y-6">
                    <h3 className="text-2xl font-bold">Question Review</h3>
                    {assessment.questions?.map((q: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className={`border-l-4 ${q.isCorrect ? 'border-l-green-500' : 'border-l-red-500'} bg-white/50 dark:bg-gray-900/50`}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-lg">
                                            <span className="text-muted-foreground mr-2">{index + 1}.</span>
                                            {q.question}
                                        </CardTitle>
                                        {q.isCorrect ? (
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                                                <CheckCircle2 className="h-3 w-3 mr-1" /> Correct
                                            </Badge>
                                        ) : (
                                            <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400">
                                                <XCircle className="h-3 w-3 mr-1" /> Incorrect
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className={`p-3 rounded-lg border ${q.isCorrect ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}>
                                            <div className="text-xs font-medium text-muted-foreground mb-1">Your Answer</div>
                                            <div className="font-medium">{q.userAnswer || "No answer"}</div>
                                        </div>
                                        {!q.isCorrect && (
                                            <div className="p-3 rounded-lg border bg-green-50/50 border-green-200">
                                                <div className="text-xs font-medium text-muted-foreground mb-1">Correct Answer</div>
                                                <div className="font-medium text-green-700 dark:text-green-400">{q.answer}</div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {q.explanation && (
                                        <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                                                <Lightbulb className="h-3 w-3" />
                                                Explanation
                                            </div>
                                            <p className="text-sm text-blue-900 dark:text-blue-200">{q.explanation}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}