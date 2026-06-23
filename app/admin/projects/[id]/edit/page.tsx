"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getProjectById } from "@/lib/firestore";
import type { Project } from "@/lib/types";
import AdminHeader from "@/components/admin/AdminHeader";
import ProjectForm from "@/components/admin/ProjectForm";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null | undefined>(undefined);

  useEffect(() => {
    getProjectById(id).then(setProject);
  }, [id]);

  if (project === undefined) {
    return (
      <>
        <AdminHeader title="Edit Project" />
        <div className="flex-1 flex items-center justify-center">
          <p className="font-inter text-white/40">Loading...</p>
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <AdminHeader title="Edit Project" />
        <div className="flex-1 p-6">
          <p className="font-inter text-white/60">Project not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Edit Project" />
      <div className="flex-1 p-6 pb-24 md:pb-6">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 font-inter text-sm text-white/60 hover:text-coral transition-colors mb-6"
        >
          <ChevronLeft size={16} /> Back to Projects
        </Link>
        <ProjectForm project={project} />
      </div>
    </>
  );
}
