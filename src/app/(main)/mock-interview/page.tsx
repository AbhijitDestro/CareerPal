"use client";

import { useEffect, useState } from "react";
import { Plus, Brain, Trophy, History, PlayCircle, Clock } from "lucide-react";
import Link from "next/link";
import { getUserAssessments } from "@/actions/assessment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export default function MockInterviewPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const data = await getUserAssessments();
        setAssessments(data);
      } catch (error) {
        console.error("Failed to fetch assessments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  return (
    <div className="min-h-screen w-full p-4 md:p-8 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-orange-500/20 blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-red-500/20 blur-[100px]" />
        </div>

      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-medium">
            <Brain className="w-4 h-4" />
            <span>AI-Powered Interview Practice</span>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                 <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                    Mock Interviews
                </h1>
                <p className="text-lg text-muted-foreground mt-2 max-w-2xl">
                    Practice technical questions tailored to your role and get instant AI feedback.
                </p>
            </div>
            <Link href="/mock-interview/new">
                <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg shadow-orange-500/25 transition-all duration-300 transform hover:scale-[1.02]">
                    <Plus className="h-4 w-4 mr-2" />
                    Start New Interview
                </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <History className="h-5 w-5 text-muted-foreground" />
                Recent Sessions
            </h2>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-40 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    ))}
                </div>
            ) : assessments.length === 0 ? (
                <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 py-12">
                    <CardContent className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-4">
                            <Brain className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No interviews yet</h3>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            Start your first mock interview to practice your skills and get better prepared.
                        </p>
                        <Link href="/mock-interview/new">
                             <Button variant="outline">Start Interview</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {assessments.map((assessment, index) => (
                        <motion.div
                            key={assessment.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card 
                                className="h-full border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all cursor-pointer group"
                                onClick={() => router.push(`/mock-interview/${assessment.id}${assessment.status === 'completed' ? '/feedback' : ''}`)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant={assessment.status === 'completed' ? "default" : "secondary"} className={assessment.status === 'completed' ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600 text-white"}>
                                            {assessment.status === 'completed' ? 'Completed' : 'In Progress'}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatDistanceToNow(new Date(assessment.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <CardTitle className="text-lg line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                        {assessment.topic}
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2">
                                        <span className="capitalize">{assessment.level}</span>
                                        <span>•</span>
                                        <span>{assessment.questions?.length || 0} Questions</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {assessment.status === 'completed' ? (
                                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                                            <Trophy className="h-4 w-4 text-yellow-500" />
                                            Score: <span className="text-foreground">{assessment.quizScore?.toFixed(0)}%</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                            <PlayCircle className="h-4 w-4" />
                                            Continue Interview
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
      </div>
    </div>
  );
}