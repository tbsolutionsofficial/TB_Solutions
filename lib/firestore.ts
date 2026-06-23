import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  onSnapshot,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Project, Review, SiteContent } from "./types";

// ─── PROJECTS ──────────────────────────────────────────────────

function projectFromDoc(doc: QueryDocumentSnapshot | DocumentSnapshot): Project {
  const data = doc.data()!;
  return { id: doc.id, ...data } as Project;
}

export async function getProjects(domainFilter?: string, limitCount = 6, lastDoc?: QueryDocumentSnapshot) {
  const constraints: Parameters<typeof query>[1][] = [orderBy("createdAt", "desc"), limit(limitCount)];
  if (domainFilter && domainFilter !== "All") {
    constraints.unshift(where("domain", "==", domainFilter));
  }
  if (lastDoc) constraints.push(startAfter(lastDoc));
  const q = query(collection(db, "projects"), ...constraints);
  const snap = await getDocs(q);
  return {
    projects: snap.docs.map(projectFromDoc),
    lastDoc: snap.docs[snap.docs.length - 1] ?? null,
    hasMore: snap.docs.length === limitCount,
  };
}

export async function getProjectById(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, "projects", id));
  return snap.exists() ? projectFromDoc(snap) : null;
}

export async function getRelatedProjects(domain: string, excludeId: string): Promise<Project[]> {
  const q = query(
    collection(db, "projects"),
    where("domain", "==", domain),
    orderBy("createdAt", "desc"),
    limit(4)
  );
  const snap = await getDocs(q);
  return snap.docs.map(projectFromDoc).filter((p) => p.id !== excludeId).slice(0, 3);
}

export async function getAllProjects(): Promise<Project[]> {
  const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(projectFromDoc);
}

export async function createProject(data: Omit<Project, "id" | "createdAt" | "updatedAt">) {
  const ref = await addDoc(collection(db, "projects"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProject(id: string, data: Partial<Omit<Project, "id" | "createdAt">>) {
  await updateDoc(doc(db, "projects", id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteProject(id: string) {
  await deleteDoc(doc(db, "projects", id));
}

// ─── REVIEWS ───────────────────────────────────────────────────

function reviewFromDoc(doc: QueryDocumentSnapshot | DocumentSnapshot): Review {
  return { id: doc.id, ...doc.data() } as Review;
}

export async function getApprovedReviews(): Promise<Review[]> {
  const q = query(
    collection(db, "reviews"),
    where("approved", "==", true),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(reviewFromDoc);
}

export async function getAllReviews(): Promise<Review[]> {
  const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(reviewFromDoc);
}

export function subscribeReviews(callback: (reviews: Review[]) => void) {
  const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => callback(snap.docs.map(reviewFromDoc)));
}

export function subscribeApprovedReviews(callback: (reviews: Review[]) => void) {
  const q = query(
    collection(db, "reviews"),
    where("approved", "==", true),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => callback(snap.docs.map(reviewFromDoc)));
}

export async function submitReview(data: Omit<Review, "id" | "approved" | "createdAt">) {
  await addDoc(collection(db, "reviews"), {
    ...data,
    approved: false,
    createdAt: serverTimestamp(),
  });
}

export async function approveReview(id: string) {
  await updateDoc(doc(db, "reviews", id), { approved: true });
}

export async function revokeReview(id: string) {
  await updateDoc(doc(db, "reviews", id), { approved: false });
}

export async function deleteReview(id: string) {
  await deleteDoc(doc(db, "reviews", id));
}

// ─── SITE CONTENT ──────────────────────────────────────────────

export async function getSiteContent(): Promise<SiteContent | null> {
  const snap = await getDoc(doc(db, "siteContent", "main"));
  return snap.exists() ? (snap.data() as SiteContent) : null;
}

export function subscribeSiteContent(callback: (content: SiteContent) => void) {
  return onSnapshot(doc(db, "siteContent", "main"), (snap) => {
    if (snap.exists()) callback(snap.data() as SiteContent);
  });
}

export async function updateSiteContent(data: Partial<SiteContent>) {
  await updateDoc(doc(db, "siteContent", "main"), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function initSiteContent(data: Omit<SiteContent, "updatedAt">) {
  const { setDoc } = await import("firebase/firestore");
  await setDoc(doc(db, "siteContent", "main"), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
