interface MeshBackgroundProps {
  variant?: "light" | "dark" | "coral";
  fixed?: boolean;
  className?: string;
}

export default function MeshBackground({ variant = "light", fixed = false, className = "" }: MeshBackgroundProps) {
  const variants = {
    light: "mesh-bg",
    dark: "mesh-bg-dark",
    coral: "mesh-bg-coral",
  };

  return (
    <div
      className={`${fixed ? "fixed" : "absolute"} inset-0 -z-10 ${variants[variant]} ${className}`}
      aria-hidden
    />
  );
}
