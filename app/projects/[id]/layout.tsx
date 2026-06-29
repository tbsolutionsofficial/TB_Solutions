import type { Metadata } from "next";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const snap = await getDoc(doc(db, "projects", id));
    if (!snap.exists()) return { title: "Project Not Found" };
    const p = snap.data();
    const title = `${p.title} — ${p.domain} Project`;
    const desc = (p.description as string).slice(0, 160);
    const keywords = [
      ...(p.tags ?? []),
      p.domain,
      "final year project",
      "project India",
      "TorchBearer Solutions",
    ];
    return {
      title,
      description: desc,
      keywords,
      openGraph: {
        title,
        description: desc,
        images: p.images?.length ? [{ url: p.images[0], alt: p.title }] : [],
        type: "article",
      },
      twitter: { card: "summary_large_image", title, description: desc },
    };
  } catch {
    return { title: "Project | TorchBearer Solutions" };
  }
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
