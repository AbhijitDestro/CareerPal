"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams, redirect } from "next/navigation";
import { getAssessment } from "@/actions/assessment";
import AssessmentSession from "@/components/mock-assessment/AssessmentSession";
import { Loader2 } from "lucide-react";

export default function InterviewSessionPage() {
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
                
                if (data.status === "completed") {
                    router.push(`/mock-interview/${data.id}/feedback`);
                    return;
                }
                
                setAssessment(data);
            } catch (error) {
                console.error("Failed to load interview:", error);
                router.push("/mock-interview");
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
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Preparing your interview...</p>
                </div>
            </div>
        );
    }

    if (!assessment) return null;

    return (
        <div className="min-h-screen w-full p-4 md:p-8 relative overflow-hidden">
             {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-500/20 blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto">
                <AssessmentSession assessment={assessment} />
            </div>
        </div>
    );
}