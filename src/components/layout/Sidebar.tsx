"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  MessageSquare,
  Sparkles,
  TrendingUp,
  User,
  Video,
  X,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: FileText, label: "Resume Analyzer", href: "/resume-analyzer" },
  { icon: MessageSquare, label: "Cover Letter", href: "/cover-letter" },
  { icon: Video, label: "Mock Interview", href: "/mock-interview" },
  { icon: Sparkles, label: "LinkedIn Optimizer", href: "/linkedin-optimizer" },
  { icon: TrendingUp, label: "Industry Insights", href: "/industry-insights" },
  { icon: Briefcase, label: "Job Search", href: "/jobs" },
];

const bottomMenuItems = [{ icon: User, label: "Profile", href: "/profile" }];

export function Sidebar({
  isOpen,
  onClose,
  onCollapseChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCollapseChange: (collapsed: boolean) => void;
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    onCollapseChange(newCollapsedState);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? "80px" : "240px",
        }}
        className="hidden md:block fixed left-0 top-0 h-full bg-background/30 backdrop-blur-xl border-r border-white/10 z-50"
      >
        <div className="flex flex-col h-full pt-4">
          {/* Logo/Header */}
          <div className="flex items-center justify-between px-4 mb-6">
            {!isCollapsed && (
              <motion.div
                initial={false}
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                className="text-xl font-bold flex gap-2 items-center"
              >
                <Sparkles className="h-5 w-5" />
                <h1>CareerPal</h1>
              </motion.div>
            )}
            <button
              onClick={toggleCollapse}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-2 space-y-1">
            {menuItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <motion.span
                    initial={false}
                    animate={{ opacity: isCollapsed ? 0 : 1 }}
                    className="text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            ))}
          </nav>

          {/* Bottom Items */}
          <div className="px-2 pb-4 space-y-1">
            {bottomMenuItems.map((item, index) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <motion.span
                    initial={false}
                    animate={{ opacity: isCollapsed ? 0 : 1 }}
                    className="text-sm"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="md:hidden fixed left-0 top-0 h-full w-64 bg-background/90 backdrop-blur-xl border-r border-white/10 z-50"
          >
            <div className="flex flex-col h-full pt-4">
              {/* Header */}
              <div className="flex items-center justify-between px-4 mb-6">
                <div className="text-xl font-bold">CareerBoost</div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 px-2 space-y-1">
                {menuItems.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Bottom Items */}
              <div className="px-2 pb-4 space-y-1">
                {bottomMenuItems.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}