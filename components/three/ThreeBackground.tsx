"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const TorchScene = dynamic(() => import("./TorchScene"), {
  ssr: false,
  loading: () => <div className="absolute inset-0" style={{ background: "#0a0a0f" }} />,
});

export default function ThreeBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0" style={{ background: "#0a0a0f" }} />}>
        <TorchScene />
      </Suspense>
    </div>
  );
}
