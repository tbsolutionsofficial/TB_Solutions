import type { ComponentType } from "react";
import {
  Brain,
  Bot,
  Wifi,
  Cpu,
  Globe,
  Smartphone,
  BarChart3,
  Plane,
  CircuitBoard,
  Cloud,
  Shield,
  Settings2,
} from "lucide-react";

type IconType = ComponentType<{ size?: number; className?: string }>;
const DOMAIN_ICONS: Record<string, IconType> = {
  "Artificial Intelligence": Brain,
  Robotics: Bot,
  "Internet of Things (IoT)": Wifi,
  "Embedded Systems": Cpu,
  "Web Development": Globe,
  "App Development": Smartphone,
  "Data Science": BarChart3,
  "Drone Technology": Plane,
  "Electronics & PCB Design": CircuitBoard,
  "Cloud Computing": Cloud,
  Cybersecurity: Shield,
  "Automation & Control Systems": Settings2,
};

interface DomainIconProps {
  domain: string;
  size?: number;
  className?: string;
}

export default function DomainIcon({ domain, size = 24, className = "" }: DomainIconProps) {
  const Icon = DOMAIN_ICONS[domain] ?? Brain;
  return <Icon size={size} className={className} />;
}
