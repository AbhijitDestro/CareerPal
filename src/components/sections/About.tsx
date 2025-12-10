"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Target, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Users Helped",
    value: "10k+",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Success Rate",
    value: "95%",
    icon: Target,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    label: "AI Interactions",
    value: "1M+",
    icon: Sparkles,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Empowering Your <span className="text-primary">Career Journey</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We believe everyone deserves a fulfilling career. Our mission is to
              democratize access to premium career coaching tools using advanced
              AI technology.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Whether you're a fresh graduate or a seasoned professional, our
              platform adapts to your unique needs, providing personalized
              guidance to help you land your dream job.
            </p>

            <div className="space-y-4">
              {[
                "Advanced AI-powered resume analysis",
                "Real-time interview practice with feedback",
                "Market-driven industry insights",
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <span className="text-foreground/80">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Stats Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -5 }}
                  className={cn(
                    "p-6 rounded-2xl border border-border/50 bg-background/40 backdrop-blur-md shadow-sm hover:shadow-md transition-all",
                    index === 2 ? "sm:col-span-2" : ""
                  )}
                >
                  <div
                    className={cn(
                      "inline-flex p-3 rounded-xl mb-4",
                      stat.bg,
                      stat.color
                    )}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}