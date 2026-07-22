"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { getDomains, createDomain, updateDomain, deleteDomain } from "@/lib/firestore";
import type { DomainDoc } from "@/lib/types";

export default function AdminDomainsPage() {
  const [domains, setDomains] = useState<DomainDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, Partial<DomainDoc>>>({});

  useEffect(() => {
    getDomains()
      .then((d) => { setDomains(d); setLoading(false); })
      .catch(() => { toast.error("Failed to load domains"); setLoading(false); });
  }, []);

  function patch(slug: string, field: string, value: unknown) {
    setEdits((prev) => ({ ...prev, [slug]: { ...prev[slug], [field]: value } }));
  }

  function getField<K extends keyof DomainDoc>(domain: DomainDoc, field: K): DomainDoc[K] {
    return (edits[domain.slug]?.[field] ?? domain[field]) as DomainDoc[K];
  }

  async function save(domain: DomainDoc) {
    const changes = edits[domain.slug];
    if (!changes) return;
    setSaving(domain.slug);
    try {
      await updateDomain(domain.slug, changes);
      setDomains((prev) => prev.map((d) => d.slug === domain.slug ? { ...d, ...changes } : d));
      setEdits((prev) => { const next = { ...prev }; delete next[domain.slug]; return next; });
      toast.success("Domain saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(null);
    }
  }

  async function remove(slug: string) {
    if (!confirm(`Delete domain "${slug}"?`)) return;
    await deleteDomain(slug);
    setDomains((prev) => prev.filter((d) => d.slug !== slug));
    toast.success("Domain deleted");
  }

  async function addNew() {
    const slug = prompt("Enter slug (e.g. artificial-intelligence):");
    if (!slug) return;
    const data: Omit<DomainDoc, "slug" | "updatedAt"> = {
      title: "New Domain",
      short: "Short description",
      icon: "Bot",
      items: [],
      overview: "",
      services: [],
      faq: [],
      featured: false,
      order: domains.length,
    };
    await createDomain(slug, data);
    setDomains((prev) => [...prev, { slug, ...data }]);
    setExpanded(slug);
    toast.success("Domain created");
  }

  if (loading) return <div className="p-8 text-muted-foreground">Loading domains…</div>;

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Domains</h1>
        <button
          onClick={addNew}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Add Domain
        </button>
      </div>

      <div className="space-y-3">
        {domains.map((domain) => (
          <div key={domain.slug} className="rounded-2xl glass overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === domain.slug ? null : domain.slug)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground bg-secondary rounded px-2 py-0.5">{domain.slug}</span>
                <span className="font-semibold text-foreground">{getField(domain, "title")}</span>
                {domain.featured && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Featured</span>}
              </div>
              {expanded === domain.slug ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>

            {expanded === domain.slug && (
              <div className="border-t border-border px-5 pb-6 pt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</label>
                    <input
                      value={String(getField(domain, "title"))}
                      onChange={(e) => patch(domain.slug, "title", e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Icon (lucide name)</label>
                    <input
                      value={String(getField(domain, "icon"))}
                      onChange={(e) => patch(domain.slug, "icon", e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Short description</label>
                    <input
                      value={String(getField(domain, "short"))}
                      onChange={(e) => patch(domain.slug, "short", e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Overview</label>
                    <textarea
                      rows={3}
                      value={String(getField(domain, "overview"))}
                      onChange={(e) => patch(domain.slug, "overview", e.target.value)}
                      className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Order</label>
                    <input
                      type="number"
                      value={Number(getField(domain, "order"))}
                      onChange={(e) => patch(domain.slug, "order", Number(e.target.value))}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <label className="text-sm font-medium text-foreground">Featured</label>
                    <input
                      type="checkbox"
                      checked={Boolean(getField(domain, "featured"))}
                      onChange={(e) => patch(domain.slug, "featured", e.target.checked)}
                      className="h-4 w-4 accent-primary"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Items (one per line)</label>
                    <textarea
                      rows={4}
                      value={(getField(domain, "items") as string[]).join("\n")}
                      onChange={(e) => patch(domain.slug, "items", e.target.value.split("\n").filter(Boolean))}
                      className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => remove(domain.slug)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                  <button
                    onClick={() => save(domain)}
                    disabled={!edits[domain.slug] || saving === domain.slug}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {saving === domain.slug ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {domains.length === 0 && (
          <div className="rounded-2xl glass p-12 text-center text-muted-foreground">
            No domains yet. Click &quot;Add Domain&quot; to seed the first one.
          </div>
        )}
      </div>
    </div>
  );
}
