import { Timestamp } from "firebase/firestore";

export interface Project {
  id: string;
  title: string;
  domain: string;
  client: string;
  description: string;
  outcome?: string;
  tags: string[];
  images: string[];
  videoUrl?: string;
  featured: boolean;
  status: "completed" | "ongoing";
  sortOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  college: string;
  company?: string;
  avatar?: string;
  domain: string;
  rating: number;
  stars?: number;
  review: string;
  approved: boolean;
  status?: "pending" | "approved" | "rejected";
  createdAt: Timestamp;
}

export interface DomainDoc {
  slug: string;
  title: string;
  short: string;
  icon: string;
  items: string[];
  overview: string;
  services: { title: string; description: string }[];
  faq: { q: string; a: string }[];
  featured: boolean;
  order: number;
  updatedAt?: Timestamp;
}

export interface GalleryItem {
  id: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  title: string;
  category: "AI" | "Robotics" | "IoT" | "Drones" | "Software";
  span?: "sm" | "md" | "lg" | "xl";
  sortOrder: number;
  createdAt: Timestamp;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  domain: string;
  imageUrl?: string;
  ctaText: string;
  active: boolean;
  sortOrder: number;
  createdAt: Timestamp;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  domains: string[];
  validUntil: string;
  badge: string;
  imageUrl?: string;
  active: boolean;
  sortOrder: number;
  createdAt: Timestamp;
}

export interface ContactSubmission {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  domain: string;
  message: string;
  read: boolean;
  createdAt: Timestamp;
}

export interface SiteContent {
  heroHeadline: string;
  heroSubtitle: string;
  phone: string;
  email: string;
  website: string;
  whatsapp?: string;
  instagram?: string;
  linkedin?: string;
  projectsCount: string;
  domainsCount: string;
  aboutTitle?: string;
  aboutText?: string;
  aboutMission?: string;
  aboutVision?: string;
  termsContent?: string;
  termsLastUpdated?: string;
  offersHeadline?: string;
  offersSubtitle?: string;
  updatedAt?: Timestamp;
}

export const DOMAINS = [
  "Artificial Intelligence",
  "Robotics",
  "Internet of Things (IoT)",
  "Embedded Systems",
  "Web Development",
  "App Development",
  "Data Science",
  "Drone Technology",
  "Electronics & PCB Design",
  "Cloud Computing",
  "Cybersecurity",
  "Automation & Control Systems",
] as const;

export type Domain = (typeof DOMAINS)[number];

export const ROLES = [
  "Student",
  "Professor",
  "Engineer",
  "Manager",
  "Other",
] as const;
