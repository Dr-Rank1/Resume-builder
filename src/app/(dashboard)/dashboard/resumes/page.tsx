"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, MoreVertical, Copy, Share, Trash2, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ResumesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resumes</h1>
          <p className="text-muted-foreground">
            Create and manage your resumes.
          </p>
        </div>
        <Link href="/dashboard/resumes/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Resume
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {resumes.map((resume) => (
          <Card key={resume.id} className="group">
            <CardHeader className="space-y-0 pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{resume.title}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/resumes/${resume.id}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      Export PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{resume.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/dashboard/resumes/${resume.id}`}>
                <div className="aspect-[8.5/11] w-full rounded-md border bg-muted transition-colors hover:bg-muted/80">
                  <div className="flex h-full items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
              </Link>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Last edited {resume.lastEdited}
                </div>
                <div className="text-sm text-muted-foreground">
                  {resume.status}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

const resumes = [
  {
    id: "1",
    title: "Software Engineer Resume",
    description: "Full-stack developer with 5 years of experience",
    lastEdited: "2 hours ago",
    status: "Active",
  },
  {
    id: "2",
    title: "Product Manager Resume",
    description: "Product leader with experience in SaaS",
    lastEdited: "1 day ago",
    status: "Draft",
  },
  {
    id: "3",
    title: "Technical Lead Resume",
    description: "Leadership and architecture focus",
    lastEdited: "3 days ago",
    status: "Active",
  },
];