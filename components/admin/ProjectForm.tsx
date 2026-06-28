"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DOMAINS } from "@/lib/types";
import type { Project } from "@/lib/types";
import { createProject, updateProject, deleteProject } from "@/lib/firestore";
import { deleteImageByUrl } from "@/lib/storage";
import { GlassInput, GlassTextarea, GlassSelect } from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import GlassModal from "@/components/ui/GlassModal";
import ImageUploader from "./ImageUploader";
import { nanoid } from "@/lib/nanoid";

const schema = z.object({
  title: z.string().min(1, "Title required"),
  domain: z.string().min(1, "Domain required"),
  client: z.string().min(1, "Client required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  outcome: z.string().optional(),
  tags: z.string().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["completed", "ongoing"]),
  videoUrl: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface ProjectFormProps {
  project?: Project;
}

export default function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(project?.images ?? []);
  const [projectId] = useState(project?.id ?? nanoid());
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [videoPreview, setVideoPreview] = useState(project?.videoUrl ?? "");

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: project?.title ?? "",
      domain: project?.domain ?? "",
      client: project?.client ?? "",
      description: project?.description ?? "",
      outcome: project?.outcome ?? "",
      tags: project?.tags?.join(", ") ?? "",
      featured: project?.featured ?? false,
      status: project?.status ?? "completed",
      videoUrl: project?.videoUrl ?? "",
    },
  });

  const videoUrl = watch("videoUrl");
  useEffect(() => {
    const raw = videoUrl ?? "";
    if (raw.includes("youtube.com/watch?v=")) {
      setVideoPreview(raw.replace("watch?v=", "embed/"));
    } else if (raw.includes("youtu.be/")) {
      const id = raw.split("youtu.be/")[1]?.split("?")[0];
      setVideoPreview(`https://www.youtube.com/embed/${id}`);
    } else {
      setVideoPreview(raw);
    }
  }, [videoUrl]);

  async function onSubmit(data: FormData) {
    const payload = {
      title: data.title,
      domain: data.domain,
      client: data.client,
      description: data.description,
      outcome: data.outcome ?? "",
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      featured: data.featured ?? false,
      status: data.status,
      images,
      videoUrl: videoPreview || "",
      sortOrder: project?.sortOrder ?? 0,
    };

    try {
      if (project) {
        await updateProject(project.id, payload);
      } else {
        await createProject(payload);
      }
      toast.success("Project saved!");
      router.push("/admin/projects");
    } catch {
      toast.error("Error saving project. Try again.");
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      for (const url of images) await deleteImageByUrl(url);
      await deleteProject(project!.id);
      toast.success("Project deleted.");
      router.push("/admin/projects");
    } catch {
      toast.error("Failed to delete.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
        <GlassInput label="Project Title *" placeholder="Enter project title" {...register("title")} error={errors.title?.message} />
        <GlassSelect label="Domain *" {...register("domain")} error={errors.domain?.message}>
          <option value="">Select domain</option>
          {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
        </GlassSelect>
        <GlassInput label="Client Name *" placeholder="Client or institution" {...register("client")} error={errors.client?.message} />
        <GlassTextarea label="Description *" placeholder="Describe the project in detail (min 50 chars)..." rows={5} {...register("description")} error={errors.description?.message} />
        <GlassInput label="Outcome / Result" placeholder="e.g. 60% reduction in processing time" {...register("outcome")} />
        <GlassInput label="Technologies Used (comma separated)" placeholder="React, Node.js, Firebase..." {...register("tags")} />

        {/* Featured toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setValue("featured", !watch("featured"))}
            className={`w-12 h-6 rounded-full transition-all cursor-pointer relative ${watch("featured") ? "bg-coral" : "bg-white/20"}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${watch("featured") ? "left-7" : "left-1"}`} />
          </button>
          <label className="font-inter text-sm text-white/70">Featured Project</label>
        </div>

        {/* Status */}
        <div>
          <label className="text-xs font-inter font-medium text-white/70 block mb-2">Project Status</label>
          <div className="flex gap-4">
            {(["completed", "ongoing"] as const).map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" value={s} {...register("status")} className="accent-coral" />
                <span className="font-inter text-sm text-white/70 capitalize">{s}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Image Uploader */}
        <ImageUploader projectId={projectId} images={images} onChange={setImages} />

        {/* Video URL */}
        <div className="space-y-3">
          <GlassInput
            label="YouTube Video URL (optional)"
            placeholder="https://www.youtube.com/watch?v=..."
            {...register("videoUrl")}
          />
          {videoPreview && videoPreview.includes("youtube") && (
            <div className="relative">
              <iframe
                src={videoPreview}
                className="w-full aspect-video rounded-2xl border border-white/10"
                allowFullScreen
              />
              <button
                type="button"
                onClick={() => { setValue("videoUrl", ""); setVideoPreview(""); }}
                className="absolute top-2 right-2 glass-dark text-white rounded-full px-3 py-1 text-xs font-inter"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
          <GlassButton type="submit" variant="coral" loading={isSubmitting}>
            Save Project
          </GlassButton>
          <GlassButton type="button" variant="ghost" onClick={() => router.push("/admin/projects")}>
            Cancel
          </GlassButton>
          {project && (
            <GlassButton
              type="button"
              variant="ghost"
              className="ml-auto text-red-400 border-red-400/30 hover:bg-red-400/10"
              onClick={() => setDeleteModal(true)}
            >
              Delete Project
            </GlassButton>
          )}
        </div>
      </form>

      <GlassModal open={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Project">
        <p className="font-inter text-body mb-6">
          This will permanently delete this project and all its images. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <GlassButton variant="light" onClick={() => setDeleteModal(false)}>Cancel</GlassButton>
          <GlassButton variant="coral" loading={deleting} onClick={handleDelete} className="!bg-red-500/80">
            Delete Project
          </GlassButton>
        </div>
      </GlassModal>
    </>
  );
}
