"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Share2,
  TrendingUp,
  Users,
  FileStack,
  Sparkles,
  Clock,
  ChevronRight,
  LayoutDashboard,
  Settings,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sidebar, MobileSidebar } from "@/components/layout/sidebar";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Sample data for resumes
const sampleResumes = [
  {
    id: "1",
    name: "Software Engineer Resume",
    template: "Modern",
    updatedAt: "2 hours ago",
    atsScore: 87,
    views: 24,
    status: "active",
  },
  {
    id: "2",
    name: "Product Manager CV",
    template: "Executive",
    updatedAt: "1 day ago",
    atsScore: 92,
    views: 56,
    status: "active",
  },
  {
    id: "3",
    name: "UX Designer Portfolio",
    template: "Creative",
    updatedAt: "3 days ago",
    atsScore: 78,
    views: 12,
    status: "draft",
  },
];

// Sample stats
const stats = [
  {
    title: "Total Views",
    value: "124",
    change: "+12%",
    positive: true,
    icon: Eye,
  },
  {
    title: "Resume Score",
    value: "85",
    change: "+5%",
    positive: true,
    icon: TrendingUp,
  },
  {
    title: "AI Generations",
    value: "47",
    change: "+8",
    positive: true,
    icon: Sparkles,
  },
];

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { theme, setTheme, resolvedTheme } = useTheme();

  const filteredResumes = sampleResumes.filter((resume) =>
    resume.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="rounded-md p-2 hover:bg-accent"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold">ResumeAI</span>
        </div>
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="rounded-md p-2 hover:bg-accent"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        theme={resolvedTheme}
        onThemeToggle={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      />

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[280px]"
        )}
      >
        <div className="mx-auto max-w-6xl p-6 lg:p-8">
          {/* Header */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="mb-8"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Welcome back, John
                </h1>
                <p className="mt-1 text-muted-foreground">
                  Here's what's happening with your resumes today.
                </p>
              </div>
              <Button asChild className="gap-2">
                <a href="/dashboard/resumes/new">
                  <Plus className="h-4 w-4" />
                  Create New Resume
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {stats.map((stat, index) => (
              <motion.div key={stat.title} variants={fadeInUp}>
                <Card hover className="relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                        <div className={cn(
                          "mt-2 flex items-center gap-1 text-xs font-medium",
                          stat.positive ? "text-success" : "text-destructive"
                        )}>
                          <TrendingUp className="h-3 w-3" />
                          {stat.change} vs last month
                        </div>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                  {/* Decorative gradient */}
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-2xl" />
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Recent Resumes - Takes 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Resumes</CardTitle>
                    <CardDescription>
                      Manage and track your resume performance
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  {/* Search */}
                  <div className="mb-4 relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search resumes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Resume List */}
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {filteredResumes.map((resume, index) => (
                        <motion.div
                          key={resume.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.05 }}
                          className="group flex items-center justify-between rounded-lg border border-border p-4 transition-all hover:border-primary/50 hover:bg-accent/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{resume.name}</h3>
                              <div className="flex items-center gap-3 mt-1">
                                <Badge variant="outline" size="sm">
                                  {resume.template}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  Updated {resume.updatedAt}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* ATS Score */}
                            <div className="hidden sm:flex items-center gap-2">
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">ATS Score</p>
                                <p className="font-semibold">{resume.atsScore}%</p>
                              </div>
                              <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${resume.atsScore}%` }}
                                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                  className={cn(
                                    "h-full rounded-full",
                                    resume.atsScore >= 80
                                      ? "bg-success"
                                      : resume.atsScore >= 60
                                      ? "bg-warning"
                                      : "bg-destructive"
                                  )}
                                />
                              </div>
                            </div>

                            {/* Views */}
                            <div className="hidden md:flex items-center gap-1 text-muted-foreground">
                              <Eye className="h-4 w-4" />
                              <span className="text-sm">{resume.views}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions - Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              {/* Quick Create */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Create</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <span>Blank Resume</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
                      <Sparkles className="h-4 w-4 text-secondary" />
                    </div>
                    <span>AI-Assisted</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                      <FileStack className="h-4 w-4 text-success" />
                    </div>
                    <span>From Template</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "Resume viewed by recruiter", time: "2 min ago", icon: Eye },
                      { action: "AI generated 3 bullets", time: "15 min ago", icon: Sparkles },
                      { action: "Profile updated", time: "1 hour ago", icon: Users },
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                          <activity.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            {activity.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Pro Tip</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Resumes with quantified achievements get 40% more views. Try adding numbers to your bullet points!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}