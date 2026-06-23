"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "@/lib/auth";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { GlassInput } from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});
type LoginForm = z.infer<typeof loginSchema>;

function TorchIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L10 8H14L12 2Z" fill="#cc785c" />
      <rect x="10" y="8" width="4" height="10" rx="2" fill="#cc785c" />
      <ellipse cx="12" cy="18" rx="3" ry="1.5" fill="#a9583e" />
      <path d="M12 4C12 4 14 6 14 7.5C14 9 13 9.5 12 9.5C11 9.5 10 9 10 7.5C10 6 12 4 12 4Z" fill="#e8a55a" opacity="0.8" />
    </svg>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const ADMIN_EMAIL = "tbsolutions.official@gmail.com";

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (u && u.email === ADMIN_EMAIL) router.replace("/admin/dashboard");
    });
  }, [router]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    if (data.email !== ADMIN_EMAIL) {
      toast.error("Access denied. Unauthorized email.");
      return;
    }
    try {
      await signIn(data.email, data.password);
      router.push("/admin/dashboard");
    } catch {
      toast.error("Invalid email or password.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg-dark" />

      <div className="relative w-full max-w-md">
        <div className="glass-dark glass-shimmer relative rounded-3xl p-10">
          <div className="flex flex-col items-center mb-8">
            <TorchIcon />
            <h1 className="font-cormorant text-4xl text-white mt-3 tracking-[-0.5px]">Admin Login</h1>
            <p className="font-inter text-sm text-white/40 mt-1">TorchBearer Solutions</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <GlassInput
              label="Email Address"
              type="email"
              placeholder="admin@example.com"
              autoComplete="email"
              {...register("email")}
              error={errors.email?.message}
            />
            <div className="relative">
              <GlassInput
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-8 text-white/40 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="pt-2">
              <GlassButton type="submit" variant="coral" fullWidth size="lg" loading={isSubmitting}>
                Login
              </GlassButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
