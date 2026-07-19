"use client";
import { useEffect, useState } from "react";

export type DeviceTier = "high" | "mid" | "low";

export interface DeviceInfo {
  tier: DeviceTier;
  isMobile: boolean;
  reducedMotion: boolean;
}

export function useDeviceTier(): DeviceInfo {
  const [info, setInfo] = useState<DeviceInfo>({
    tier: "high",
    isMobile: false,
    reducedMotion: false,
  });

  useEffect(() => {
    const isMobile =
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
      window.innerWidth < 768;
    const cores = navigator.hardwareConcurrency ?? 8;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mem = (navigator as any).deviceMemory ?? 8;
    const isLowEnd = cores <= 4 || mem <= 2;
    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let tier: DeviceTier = "high";
    if (isLowEnd || reducedMotion) tier = "low";
    else if (isMobile) tier = "mid";

    setInfo({ tier, isMobile, reducedMotion });
  }, []);

  return info;
}
