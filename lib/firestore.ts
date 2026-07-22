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
  writeBatch,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Project, Review, SiteContent, Banner, Offer, ContactSubmission, DomainDoc, GalleryItem } from "./types";

// ─── PROJECTS ──────────────────────────────────────────────────

function projectFromDoc(doc: QueryDocumentSnapshot | DocumentSnapshot): Project {
  const data = doc.data()!;
  return { id: doc.id, sortOrder: 0, ...data } as Project;
}

export async function getProjects(domainFilter?: string, limitCount = 6, lastDoc?: QueryDocumentSnapshot) {
  // No orderBy on sortOrder — old projects may not have the field and would be excluded by Firestore.
  // Instead fetch filtered docs and sort client-side.
  const constraints: Parameters<typeof query>[1][] = [];
  if (domainFilter && domainFilter !== "All") {
    constraints.push(where("domain", "==", domainFilter));
  }
  if (lastDoc) constraints.push(startAfter(lastDoc));
  const q = query(collection(db, "projects"), ...constraints);
  const snap = await getDocs(q);
  const projects = snap.docs
    .map(projectFromDoc)
    .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  const paginated = projects.slice(0, limitCount);
  return {
    projects: paginated,
    lastDoc: snap.docs[snap.docs.length - 1] ?? null,
    hasMore: snap.docs.length > limitCount,
  };
}

export async function getProjectById(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, "projects", id));
  return snap.exists() ? projectFromDoc(snap) : null;
}

export async function getRelatedProjects(domain: string, excludeId: string): Promise<Project[]> {
  const q = query(collection(db, "projects"), where("domain", "==", domain), limit(6));
  const snap = await getDocs(q);
  return snap.docs
    .map(projectFromDoc)
    .filter((p) => p.id !== excludeId)
    .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999))
    .slice(0, 3);
}

export async function getAllProjects(): Promise<Project[]> {
  // No orderBy — sorts client-side so old projects without sortOrder are included
  const snap = await getDocs(collection(db, "projects"));
  return snap.docs
    .map(projectFromDoc)
    .sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
}

export async function createProject(data: Omit<Project, "id" | "createdAt" | "updatedAt">) {
  // Set sortOrder to end of list
  const all = await getAllProjects();
  const maxOrder = all.length > 0 ? Math.max(...all.map((p) => p.sortOrder ?? 0)) : -1;
  const ref = await addDoc(collection(db, "projects"), {
    ...data,
    sortOrder: maxOrder + 1,
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

export async function reorderProjects(orderedIds: string[]) {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(db, "projects", id), { sortOrder: index, updatedAt: serverTimestamp() });
  });
  await batch.commit();
}

// ─── REVIEWS ───────────────────────────────────────────────────

function reviewFromDoc(doc: QueryDocumentSnapshot | DocumentSnapshot): Review {
  return { id: doc.id, ...doc.data() } as Review;
}

export async function getApprovedReviews(): Promise<Review[]> {
  // Fetch without orderBy to avoid composite index requirement, sort client-side
  const q = query(collection(db, "reviews"), where("approved", "==", true));
  const snap = await getDocs(q);
  return snap.docs
    .map(reviewFromDoc)
    .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
}

export async function getAllReviews(): Promise<Review[]> {
  // No orderBy — avoids needing composite index; sort client-side
  const snap = await getDocs(collection(db, "reviews"));
  return snap.docs
    .map(reviewFromDoc)
    .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
}

export function subscribeReviews(callback: (reviews: Review[]) => void) {
  // No orderBy — avoids composite index; sort client-side
  return onSnapshot(collection(db, "reviews"), (snap) => {
    const reviews = snap.docs
      .map(reviewFromDoc)
      .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
    callback(reviews);
  });
}

export function subscribeApprovedReviews(callback: (reviews: Review[]) => void) {
  // Filter only, no orderBy — avoids composite index requirement
  const q = query(collection(db, "reviews"), where("approved", "==", true));
  return onSnapshot(q, (snap) => {
    const reviews = snap.docs
      .map(reviewFromDoc)
      .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
    callback(reviews);
  });
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

// ─── BANNERS ───────────────────────────────────────────────────

function bannerFromDoc(doc: QueryDocumentSnapshot | DocumentSnapshot): Banner {
  return { id: doc.id, sortOrder: 0, ...doc.data() } as Banner;
}

export async function getAllBanners(): Promise<Banner[]> {
  const q = query(collection(db, "banners"), orderBy("sortOrder", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map(bannerFromDoc);
}

export async function getActiveBanners(): Promise<Banner[]> {
  const q = query(collection(db, "banners"), where("active", "==", true));
  const snap = await getDocs(q);
  return snap.docs
    .map(bannerFromDoc)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export async function createBanner(data: Omit<Banner, "id" | "createdAt">) {
  const all = await getAllBanners();
  const maxOrder = all.length > 0 ? Math.max(...all.map((b) => b.sortOrder ?? 0)) : -1;
  const ref = await addDoc(collection(db, "banners"), {
    ...data,
    sortOrder: maxOrder + 1,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateBanner(id: string, data: Partial<Omit<Banner, "id" | "createdAt">>) {
  await updateDoc(doc(db, "banners", id), data);
}

export async function deleteBanner(id: string) {
  await deleteDoc(doc(db, "banners", id));
}

export async function reorderBanners(orderedIds: string[]) {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(db, "banners", id), { sortOrder: index });
  });
  await batch.commit();
}

// ─── OFFERS ────────────────────────────────────────────────────

function offerFromDoc(doc: QueryDocumentSnapshot | DocumentSnapshot): Offer {
  return { id: doc.id, sortOrder: 0, ...doc.data() } as Offer;
}

export async function getAllOffers(): Promise<Offer[]> {
  const q = query(collection(db, "offers"), orderBy("sortOrder", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map(offerFromDoc);
}

export async function getActiveOffers(): Promise<Offer[]> {
  const q = query(collection(db, "offers"), where("active", "==", true));
  const snap = await getDocs(q);
  return snap.docs
    .map(offerFromDoc)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export async function createOffer(data: Omit<Offer, "id" | "createdAt">) {
  const all = await getAllOffers();
  const maxOrder = all.length > 0 ? Math.max(...all.map((o) => o.sortOrder ?? 0)) : -1;
  const ref = await addDoc(collection(db, "offers"), {
    ...data,
    sortOrder: maxOrder + 1,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateOffer(id: string, data: Partial<Omit<Offer, "id" | "createdAt">>) {
  await updateDoc(doc(db, "offers", id), data);
}

export async function deleteOffer(id: string) {
  await deleteDoc(doc(db, "offers", id));
}

export async function reorderOffers(orderedIds: string[]) {
  const batch = writeBatch(db);
  orderedIds.forEach((id, index) => {
    batch.update(doc(db, "offers", id), { sortOrder: index });
  });
  await batch.commit();
}

// ─── DOMAINS ───────────────────────────────────────────────────

function domainFromDoc(d: QueryDocumentSnapshot | DocumentSnapshot): DomainDoc {
  return { slug: d.id, ...d.data() } as DomainDoc;
}

export async function getDomains(): Promise<DomainDoc[]> {
  const snap = await getDocs(collection(db, "domains"));
  return snap.docs
    .map(domainFromDoc)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export async function getDomainBySlug(slug: string): Promise<DomainDoc | null> {
  const snap = await getDoc(doc(db, "domains", slug));
  return snap.exists() ? domainFromDoc(snap) : null;
}

export async function updateDomain(slug: string, data: Partial<Omit<DomainDoc, "slug">>) {
  await updateDoc(doc(db, "domains", slug), { ...data, updatedAt: serverTimestamp() });
}

export async function createDomain(slug: string, data: Omit<DomainDoc, "slug" | "updatedAt">) {
  const { setDoc } = await import("firebase/firestore");
  await setDoc(doc(db, "domains", slug), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDomain(slug: string) {
  await deleteDoc(doc(db, "domains", slug));
}

// ─── GALLERY ───────────────────────────────────────────────────

function galleryFromDoc(d: QueryDocumentSnapshot | DocumentSnapshot): GalleryItem {
  return { id: d.id, sortOrder: 0, ...d.data() } as GalleryItem;
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const snap = await getDocs(collection(db, "gallery"));
  return snap.docs
    .map(galleryFromDoc)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}

export async function createGalleryItem(data: Omit<GalleryItem, "id" | "createdAt">): Promise<string> {
  const ref = await addDoc(collection(db, "gallery"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateGalleryItem(id: string, data: Partial<Omit<GalleryItem, "id" | "createdAt">>) {
  await updateDoc(doc(db, "gallery", id), data);
}

export async function deleteGalleryItem(id: string) {
  await deleteDoc(doc(db, "gallery", id));
}

export async function updateReviewStatus(id: string, status: "pending" | "approved" | "rejected") {
  await updateDoc(doc(db, "reviews", id), {
    status,
    approved: status === "approved",
  });
}

// ─── CONTACT SUBMISSIONS ───────────────────────────────────────

function contactFromDoc(doc: QueryDocumentSnapshot | DocumentSnapshot): ContactSubmission {
  return { id: doc.id, ...doc.data() } as ContactSubmission;
}

export async function saveContactSubmission(data: Omit<ContactSubmission, "id" | "createdAt" | "read">) {
  const ref = await addDoc(collection(db, "contacts"), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getAllContacts(): Promise<ContactSubmission[]> {
  const snap = await getDocs(collection(db, "contacts"));
  return snap.docs
    .map(contactFromDoc)
    .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
}

export async function markContactRead(id: string) {
  await updateDoc(doc(db, "contacts", id), { read: true });
}

export async function deleteContact(id: string) {
  await deleteDoc(doc(db, "contacts", id));
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
