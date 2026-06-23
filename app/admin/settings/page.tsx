"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { changePassword, changeEmail } from "@/lib/auth";
import AdminHeader from "@/components/admin/AdminHeader";
import { GlassInput } from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const emailSchema = z.object({
  newEmail: z.string().email("Valid email required"),
  currentPassword: z.string().min(1, "Current password required"),
});

type PasswordForm = z.infer<typeof passwordSchema>;
type EmailForm = z.infer<typeof emailSchema>;

export default function AdminSettingsPage() {
  const { user } = useAuth();

  const pwForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });
  const emailForm = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });

  async function handleChangePassword(data: PasswordForm) {
    if (!user) return;
    try {
      await changePassword(user, data.currentPassword, data.newPassword);
      toast.success("Password updated successfully.");
      pwForm.reset();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed";
      if (msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        toast.error("Current password is incorrect.");
      } else {
        toast.error("Failed to update password.");
      }
    }
  }

  async function handleChangeEmail(data: EmailForm) {
    if (!user) return;
    try {
      await changeEmail(user, data.currentPassword, data.newEmail);
      toast.success("Email updated successfully.");
      emailForm.reset();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed";
      if (msg.includes("wrong-password") || msg.includes("invalid-credential")) {
        toast.error("Current password is incorrect.");
      } else {
        toast.error("Failed to update email.");
      }
    }
  }

  return (
    <>
      <AdminHeader title="Settings" />
      <div className="flex-1 p-6 pb-24 md:pb-6">
        <div className="max-w-lg mx-auto space-y-6">
          {/* Current info */}
          <div className="glass-dark rounded-2xl p-6">
            <p className="font-inter text-xs text-white/40 uppercase tracking-wider mb-1">Current Admin Email</p>
            <p className="font-inter text-white">{user?.email ?? "—"}</p>
          </div>

          {/* Change Password */}
          <div className="glass-dark rounded-2xl p-6 space-y-4">
            <h2 className="font-cormorant text-xl text-white">Change Password</h2>
            <form onSubmit={pwForm.handleSubmit(handleChangePassword)} className="space-y-4">
              <GlassInput label="Current Password" type="password" {...pwForm.register("currentPassword")} error={pwForm.formState.errors.currentPassword?.message} />
              <GlassInput label="New Password" type="password" {...pwForm.register("newPassword")} error={pwForm.formState.errors.newPassword?.message} />
              <GlassInput label="Confirm New Password" type="password" {...pwForm.register("confirmPassword")} error={pwForm.formState.errors.confirmPassword?.message} />
              <GlassButton type="submit" variant="coral" fullWidth loading={pwForm.formState.isSubmitting}>
                Update Password
              </GlassButton>
            </form>
          </div>

          {/* Change Email */}
          <div className="glass-dark rounded-2xl p-6 space-y-4">
            <h2 className="font-cormorant text-xl text-white">Change Admin Email</h2>
            <form onSubmit={emailForm.handleSubmit(handleChangeEmail)} className="space-y-4">
              <GlassInput label="New Email Address" type="email" {...emailForm.register("newEmail")} error={emailForm.formState.errors.newEmail?.message} />
              <GlassInput label="Current Password (to confirm)" type="password" {...emailForm.register("currentPassword")} error={emailForm.formState.errors.currentPassword?.message} />
              <GlassButton type="submit" variant="coral" fullWidth loading={emailForm.formState.isSubmitting}>
                Update Email
              </GlassButton>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

