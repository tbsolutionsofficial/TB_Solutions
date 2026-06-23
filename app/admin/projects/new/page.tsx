export const dynamic = "force-dynamic";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AdminHeader from "@/components/admin/AdminHeader";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <>
      <AdminHeader title="Add New Project" />
      <div className="flex-1 p-6 pb-24 md:pb-6">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 font-inter text-sm text-white/60 hover:text-coral transition-colors mb-6"
        >
          <ChevronLeft size={16} /> Back to Projects
        </Link>
        <ProjectForm />
      </div>
    </>
  );
}

