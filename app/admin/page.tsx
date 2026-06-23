"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
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
            <div className="bg-white/95 rounded-2xl px-5 py-3 mb-2">
              <Image
                src="/logo.png"
                alt="TB Solutions"
                width={220}
                height={60}
                className="h-14 w-auto object-contain"
                priority
              />
            </div>
            <h1 className="font-cormorant text-3xl text-white tracking-[-0.5px]">Admin Login</h1>
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
