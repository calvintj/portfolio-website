"use client";

import {
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
  useEffect,
  useState,
} from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiPlus,
  FiTrash2,
  FiUpload,
  FiX,
} from "react-icons/fi";
import type { Content, Project } from "@/types/content";

/* ---------- form primitives ---------- */

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors focus:border-teal-400/50 focus:ring-1 focus:ring-teal-400/50";

function Label({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-zinc-500">
      {children}
    </span>
  );
}

function Field({
  label,
  ...props
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input className={inputClass} {...props} />
    </label>
  );
}

function Area({
  label,
  ...props
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <textarea className={`${inputClass} resize-y`} {...props} />
    </label>
  );
}

function TagInput({
  label,
  tags,
  onChange,
}: {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const commit = () => {
    const parts = draft
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t && !tags.includes(t));
    if (parts.length) onChange([...tags, ...parts]);
    setDraft("");
  };

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-2 py-1.5 transition-colors focus-within:border-teal-400/50 focus-within:ring-1 focus-within:ring-teal-400/50">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-800 px-2 py-0.5 font-mono text-xs text-zinc-300"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="text-zinc-500 hover:text-red-400"
            >
              <FiX className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            } else if (e.key === "Backspace" && !draft && tags.length) {
              onChange(tags.slice(0, -1));
            }
          }}
          placeholder={tags.length ? "" : "Type and press Enter…"}
          className="min-w-28 flex-1 bg-transparent px-1 py-0.5 text-sm text-zinc-200 placeholder-zinc-600 outline-none"
        />
      </div>
    </div>
  );
}

function ImagePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.set("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!data.url) throw new Error(data.error || "Upload failed");
        onChange(data.url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-start gap-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-mono text-[10px] text-zinc-600">none</span>
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <button
            type="button"
            onClick={pick}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-teal-400/50 hover:text-teal-300 disabled:opacity-50"
          >
            <FiUpload className="h-3.5 w-3.5" />
            {uploading ? "Uploading…" : "Upload image"}
          </button>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="or paste an image URL"
            className={inputClass}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}

/* ---------- collapsible entry card ---------- */

function EntryCard({
  title,
  subtitle,
  onRemove,
  onMoveUp,
  onMoveDown,
  defaultOpen,
  children,
}: {
  title: string;
  subtitle?: string;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/30">
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          {open ? (
            <FiChevronUp className="h-4 w-4 shrink-0 text-zinc-500" />
          ) : (
            <FiChevronDown className="h-4 w-4 shrink-0 text-zinc-500" />
          )}
          <span className="truncate text-sm font-medium text-zinc-200">
            {title || "Untitled"}
          </span>
          {subtitle && (
            <span className="hidden truncate font-mono text-xs text-zinc-500 sm:block">
              {subtitle}
            </span>
          )}
        </button>
        <div className="flex shrink-0 items-center gap-1">
          {onMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              aria-label="Move up"
              className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
            >
              <FiChevronUp className="h-4 w-4" />
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              aria-label="Move down"
              className="rounded p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
            >
              <FiChevronDown className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove"
            className="rounded p-1.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {open && (
        <div className="space-y-4 border-t border-zinc-800/60 p-4">
          {children}
        </div>
      )}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 px-4 py-3 text-sm text-zinc-400 transition-colors hover:border-teal-400/50 hover:text-teal-300"
    >
      <FiPlus className="h-4 w-4" />
      {label}
    </button>
  );
}

/* ---------- generic timeline editor (experience / certs / orgs) ---------- */

type TimelineItem = {
  year: string;
  role: string;
  company: string;
  description: string;
  technologies: string[];
};

function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function TimelineEditor({
  items,
  onChange,
  addLabel,
  companyLabel,
  roleLabel,
}: {
  items: TimelineItem[];
  onChange: (items: TimelineItem[]) => void;
  addLabel: string;
  companyLabel: string;
  roleLabel: string;
}) {
  const patch = (i: number, p: Partial<TimelineItem>) => {
    const next = [...items];
    next[i] = { ...next[i], ...p };
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <EntryCard
          // biome-ignore lint/suspicious/noArrayIndexKey: entries have no stable id and are reorderable by index
          key={i}
          title={item.role}
          subtitle={item.company}
          defaultOpen={!item.role && !item.company}
          onRemove={() => onChange(items.filter((_, j) => j !== i))}
          onMoveUp={
            i > 0 ? () => onChange(moveItem(items, i, i - 1)) : undefined
          }
          onMoveDown={
            i < items.length - 1
              ? () => onChange(moveItem(items, i, i + 1))
              : undefined
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Period"
              value={item.year}
              placeholder="Jan 2026 – Present"
              onChange={(e) => patch(i, { year: e.target.value })}
            />
            <Field
              label={roleLabel}
              value={item.role}
              onChange={(e) => patch(i, { role: e.target.value })}
            />
          </div>
          <Field
            label={companyLabel}
            value={item.company}
            onChange={(e) => patch(i, { company: e.target.value })}
          />
          <Area
            label="Description"
            value={item.description}
            rows={4}
            onChange={(e) => patch(i, { description: e.target.value })}
          />
          <TagInput
            label="Technologies / tags"
            tags={item.technologies}
            onChange={(tags) => patch(i, { technologies: tags })}
          />
        </EntryCard>
      ))}
      <AddButton
        label={addLabel}
        onClick={() =>
          onChange([
            ...items,
            {
              year: "",
              role: "",
              company: "",
              description: "",
              technologies: [],
            },
          ])
        }
      />
    </div>
  );
}

/* ---------- projects editor ---------- */

function ProjectsEditor({
  projects,
  onChange,
}: {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}) {
  const patch = (i: number, p: Partial<Project>) => {
    const next = [...projects];
    next[i] = { ...next[i], ...p };
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {projects.map((project, i) => (
        <EntryCard
          // biome-ignore lint/suspicious/noArrayIndexKey: entries have no stable id and are reorderable by index
          key={i}
          title={project.title.text}
          subtitle={project.technologies.slice(0, 3).join(" · ")}
          defaultOpen={!project.title.text}
          onRemove={() => onChange(projects.filter((_, j) => j !== i))}
          onMoveUp={
            i > 0 ? () => onChange(moveItem(projects, i, i - 1)) : undefined
          }
          onMoveDown={
            i < projects.length - 1
              ? () => onChange(moveItem(projects, i, i + 1))
              : undefined
          }
        >
          <ImagePicker
            label="Cover image"
            value={project.image}
            onChange={(url) => patch(i, { image: url })}
          />
          <div>
            <Label>Cover fit</Label>
            <div className="flex gap-2">
              {(["cover", "contain"] as const).map((fit) => {
                const active = (project.imageFit ?? "cover") === fit;
                return (
                  <button
                    key={fit}
                    type="button"
                    onClick={() => patch(i, { imageFit: fit })}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? "border-teal-400/50 bg-teal-400/10 text-teal-300"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                  >
                    {fit === "cover" ? "Fill (photos)" : "Fit (logos)"}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Title"
              value={project.title.text}
              onChange={(e) =>
                patch(i, { title: { ...project.title, text: e.target.value } })
              }
            />
            <Field
              label="Link (optional)"
              value={project.title.link ?? ""}
              placeholder="https://…"
              onChange={(e) =>
                patch(i, {
                  title: {
                    ...project.title,
                    link: e.target.value || undefined,
                  },
                })
              }
            />
          </div>
          <Area
            label="Description"
            value={project.description}
            rows={3}
            onChange={(e) => patch(i, { description: e.target.value })}
          />
          <TagInput
            label="Technologies"
            tags={project.technologies}
            onChange={(tags) => patch(i, { technologies: tags })}
          />
        </EntryCard>
      ))}
      <AddButton
        label="Add project"
        onClick={() =>
          onChange([
            ...projects,
            {
              title: { text: "" },
              image: "",
              description: "",
              technologies: [],
            },
          ])
        }
      />
    </div>
  );
}

/* ---------- page ---------- */

const TABS = [
  "Profile",
  "Experience",
  "Projects",
  "Certifications",
  "Organizations",
  "Contact",
] as const;
type Tab = (typeof TABS)[number];

export default function AdminPage() {
  const [content, setContent] = useState<Content | null>(null);
  const [savedJson, setSavedJson] = useState("");
  const [tab, setTab] = useState<Tab>("Profile");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        setContent(data);
        setSavedJson(JSON.stringify(data));
      })
      .catch(() => setMessage({ type: "err", text: "Failed to load content" }));
  }, []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, [message]);

  if (content === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0c] font-mono text-sm text-zinc-500">
        Loading…
      </div>
    );
  }

  const dirty = JSON.stringify(content) !== savedJson;
  const update = (patch: Partial<Content>) =>
    setContent((c) => (c ? { ...c, ...patch } : c));

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSavedJson(JSON.stringify(content));
      setMessage({ type: "ok", text: "Saved" });
    } catch (e) {
      setMessage({
        type: "err",
        text: e instanceof Error ? e.message : "Save failed",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-300">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <a href="/" className="font-mono text-sm text-zinc-100">
              calvin<span className="text-teal-300">.hendra</span>
              <span className="ml-2 text-zinc-500">/ admin</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            {message && (
              <span
                className={`font-mono text-xs ${
                  message.type === "ok" ? "text-teal-300" : "text-red-400"
                }`}
              >
                {message.text}
              </span>
            )}
            {dirty && !message && (
              <span className="font-mono text-xs text-amber-400">
                unsaved changes
              </span>
            )}
            <button
              type="button"
              onClick={save}
              disabled={saving || !dirty}
              className="rounded-lg bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="mx-auto max-w-3xl overflow-x-auto px-6">
          <div className="flex gap-1 pb-2">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  tab === t
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-4 px-6 py-8 pb-24">
        {tab === "Profile" && (
          <div className="space-y-4">
            <ImagePicker
              label="Profile photo"
              value={content.profileImage}
              onChange={(url) => update({ profileImage: url })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                value={content.name}
                onChange={(e) => update({ name: e.target.value })}
              />
              <Field
                label="Nickname"
                value={content.nickname}
                onChange={(e) => update({ nickname: e.target.value })}
              />
            </div>
            <Field
              label="Position / title"
              value={content.position}
              onChange={(e) => update({ position: e.target.value })}
            />
            <Area
              label="Hero bio"
              value={content.heroContent}
              rows={6}
              onChange={(e) => update({ heroContent: e.target.value })}
            />
          </div>
        )}

        {tab === "Experience" && (
          <TimelineEditor
            items={content.experiences}
            onChange={(experiences) => update({ experiences })}
            addLabel="Add experience"
            roleLabel="Role"
            companyLabel="Company"
          />
        )}

        {tab === "Projects" && (
          <ProjectsEditor
            projects={content.projects}
            onChange={(projects) => update({ projects })}
          />
        )}

        {tab === "Certifications" && (
          <TimelineEditor
            items={content.certifications}
            onChange={(certifications) => update({ certifications })}
            addLabel="Add certification"
            roleLabel="Title"
            companyLabel="Issuer"
          />
        )}

        {tab === "Organizations" && (
          <TimelineEditor
            items={content.organizations}
            onChange={(organizations) => update({ organizations })}
            addLabel="Add organization"
            roleLabel="Role"
            companyLabel="Organization"
          />
        )}

        {tab === "Contact" && (
          <div className="space-y-4">
            <Field
              label="Email"
              type="email"
              value={content.contact.email}
              onChange={(e) =>
                update({
                  contact: { ...content.contact, email: e.target.value },
                })
              }
            />
            <Field
              label="Phone"
              value={content.contact.phoneNo}
              onChange={(e) =>
                update({
                  contact: { ...content.contact, phoneNo: e.target.value },
                })
              }
            />
            <Field
              label="Location / domicile"
              value={content.contact.domicile}
              onChange={(e) =>
                update({
                  contact: { ...content.contact, domicile: e.target.value },
                })
              }
            />
          </div>
        )}
      </main>
    </div>
  );
}
