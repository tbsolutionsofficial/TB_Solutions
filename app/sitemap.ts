import { MetadataRoute } from "next";
import { getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://tbsolutions.online";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  try {
    const snap = await getDocs(collection(db, "projects"));
    const projectRoutes: MetadataRoute.Sitemap = snap.docs.map((doc) => ({
      url: `${base}/projects/${doc.id}`,
      lastModified: doc.data().updatedAt?.toDate?.() ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
    return [...staticRoutes, ...projectRoutes];
  } catch {
    return staticRoutes;
  }
}
