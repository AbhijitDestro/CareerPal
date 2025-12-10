"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, Building2, Globe, Clock, Banknote, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { searchJobs, type Job } from "@/actions/jobs";
import Link from "next/link";

export default function JobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setHasSearched(true);
        setJobs([]);

        const formData = new FormData(event.currentTarget);
        const jobTitle = formData.get("jobTitle") as string;
        const industry = formData.get("industry") as string;
        const location = formData.get("location") as string;

        // Combine job title and industry for better keyword search
        const keywords = `${jobTitle} ${industry}`.trim();

        try {
            const results = await searchJobs(keywords, location);
            setJobs(results.slice(0, 10)); // Ensure we limit to 10 as requested, though API might already do it
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full bg-background text-foreground relative overflow-hidden">
             {/* Background Effects */}
             <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] dark:bg-purple-600/10" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] dark:bg-blue-600/10" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        Find Your Next Career Move
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Search through thousands of job openings tailored to your skills and industry.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-16"
                >
                    <Card className="bg-white/50 dark:bg-zinc-900/50 border-input dark:border-white/10 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-xl text-foreground">Search Criteria</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="jobTitle" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Search className="w-4 h-4" /> Job Title
                                    </label>
                                    <Input
                                        id="jobTitle"
                                        name="jobTitle"
                                        placeholder="e.g. Frontend Developer"
                                        className="bg-background/50 dark:bg-black/40 border-input dark:border-white/10 text-foreground placeholder:text-muted-foreground focus-visible:ring-blue-500/50"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="industry" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <Building2 className="w-4 h-4" /> Industry
                                    </label>
                                    <Input
                                        id="industry"
                                        name="industry"
                                        placeholder="e.g. Technology"
                                        className="bg-background/50 dark:bg-black/40 border-input dark:border-white/10 text-foreground placeholder:text-muted-foreground focus-visible:ring-blue-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="location" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> Location
                                    </label>
                                    <Input
                                        id="location"
                                        name="location"
                                        placeholder="e.g. New York, Remote"
                                        className="bg-background/50 dark:bg-black/40 border-input dark:border-white/10 text-foreground placeholder:text-muted-foreground focus-visible:ring-blue-500/50"
                                        required
                                    />
                                </div>
                                <div className="flex items-end">
                                    <Button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all"
                                    >
                                        {isLoading ? "Searching..." : "Search Jobs"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                <div className="space-y-6">
                    {isLoading && (
                        <div className="grid grid-cols-1 gap-4">
                             {[1, 2, 3].map((i) => (
                                <div key={i} className="h-40 w-full bg-muted/50 rounded-xl animate-pulse border border-border" />
                            ))}
                        </div>
                    )}

                    {!isLoading && hasSearched && jobs.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                             <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                             <p>No jobs found matching your criteria. Try adjusting your search.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        {jobs.map((job, index) => (
                            <motion.div
                                key={job.id || index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <Card className="group bg-card/50 dark:bg-zinc-900/40 border-border dark:border-white/5 hover:border-blue-500/30 hover:bg-muted/50 dark:hover:bg-zinc-900/60 transition-all duration-300 overflow-hidden">
                                     <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors">
                                                            {job.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                                            {job.company && (
                                                                <span className="flex items-center text-sm font-medium text-foreground/80">
                                                                     <Building2 className="w-3.5 h-3.5 mr-1" />
                                                                     {job.company}
                                                                </span>
                                                            )}
                                                            {job.location && (
                                                                <span className="flex items-center text-sm">
                                                                     <MapPin className="w-3.5 h-3.5 mr-1" />
                                                                     {job.location}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="py-2">
                                                    <div 
                                                        className="text-sm text-muted-foreground line-clamp-2 prose dark:prose-invert max-w-none"
                                                        dangerouslySetInnerHTML={{ __html: job.snippet }}
                                                    />
                                                </div>

                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {job.salary && (
                                                        <Badge variant="secondary" className="bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 border-green-500/20">
                                                            <Banknote className="w-3 h-3 mr-1" />
                                                            {job.salary}
                                                        </Badge>
                                                    )}
                                                    {job.type && (
                                                        <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 border-purple-500/20">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {job.type}
                                                        </Badge>
                                                    )}
                                                    {job.source && (
                                                        <Badge variant="outline" className="text-muted-foreground border-border">
                                                            via {job.source}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center md:self-center">
                                                <Button asChild size="sm" className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
                                                    <Link href={job.link} target="_blank" rel="noopener noreferrer">
                                                        Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                     </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
