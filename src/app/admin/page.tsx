"use client";

import { useState, useEffect } from "react";
import type { Content, Experience, Certification, Organization, Project } from "@/types/content";

export default function AdminPage() {
  const [content, setContent] = useState<Content | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => setContent(data))
      .catch(() => setMessage({ type: "err", text: "Failed to load content" }));
  }, []);

  const uploadFile = async (field: "profileImage" | "project", projectIndex?: number): Promise<string | null> => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    return new Promise((resolve) => {
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) return resolve(null);
        const formData = new FormData();
        formData.set("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) {
          if (field === "profileImage" && content) setContent({ ...content, profileImage: data.url });
          if (field === "project" && content && projectIndex !== undefined) {
            const next = [...content.projects];
            next[projectIndex] = { ...next[projectIndex], image: data.url };
            setContent({ ...content, projects: next });
          }
          resolve(data.url);
        } else resolve(null);
      };
      input.click();
    });
  };

  const save = async () => {
    if (!content) return;
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
      setMessage({ type: "ok", text: "Saved successfully" });
    } catch (e) {
      setMessage({ type: "err", text: e instanceof Error ? e.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  if (content === null) {
    return (
      <div className="min-h-screen bg-[#00091d] flex items-center justify-center text-neutral-400">
        Loading...
      </div>
    );
  }

  const update = (patch: Partial<Content>) => setContent((c) => (c ? { ...c, ...patch } : c));
  const updateContact = (patch: Partial<Content["contact"]>) =>
    setContent((c) => (c ? { ...c, contact: { ...c.contact, ...patch } } : c));
  const setExperiences = (list: Experience[]) => update({ experiences: list });
  const setCertifications = (list: Certification[]) => update({ certifications: list });
  const setOrganizations = (list: Organization[]) => update({ organizations: list });
  const setProjects = (list: Project[]) => update({ projects: list });

  return (
    <div className="min-h-screen bg-[#00091d] text-neutral-300 p-6 pb-24">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Admin – Edit content</h1>
          <a
            href="/"
            className="text-sm text-purple-400 hover:underline"
          >
            ← Back to site
          </a>
        </div>

        {message && (
          <p
            className={`p-3 rounded-lg text-sm ${
              message.type === "ok" ? "bg-green-900/40 text-green-300" : "bg-red-900/40 text-red-300"
            }`}
          >
            {message.text}
          </p>
        )}

        {/* Profile & Hero */}
        <section className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-neutral-700 pb-2">
            Profile & Hero
          </h2>
          <div className="flex items-center gap-4">
            <img
              src={content.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-lg object-cover border border-neutral-700"
            />
            <div>
              <button
                type="button"
                onClick={() => uploadFile("profileImage")}
                className="rounded-lg bg-purple-700 px-3 py-1.5 text-sm hover:bg-purple-600"
              >
                Upload photo
              </button>
              <input
                type="text"
                value={content.profileImage}
                onChange={(e) => update({ profileImage: e.target.value })}
                placeholder="Or paste image URL"
                className="mt-2 w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm"
              />
            </div>
          </div>
          <label className="block">
            <span className="text-sm text-neutral-400">Full name</span>
            <input
              type="text"
              value={content.name}
              onChange={(e) => update({ name: e.target.value })}
              className="mt-1 w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm text-neutral-400">Nickname</span>
            <input
              type="text"
              value={content.nickname}
              onChange={(e) => update({ nickname: e.target.value })}
              className="mt-1 w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm text-neutral-400">Position / title</span>
            <input
              type="text"
              value={content.position}
              onChange={(e) => update({ position: e.target.value })}
              className="mt-1 w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm text-neutral-400">Hero bio (paragraph)</span>
            <textarea
              value={content.heroContent}
              onChange={(e) => update({ heroContent: e.target.value })}
              rows={5}
              className="mt-1 w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-2 resize-y"
            />
          </label>
        </section>

        {/* Contact */}
        <section className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-neutral-700 pb-2">
            Contact
          </h2>
          <label className="block">
            <span className="text-sm text-neutral-400">Email</span>
            <input
              type="email"
              value={content.contact.email}
              onChange={(e) => updateContact({ email: e.target.value })}
              className="mt-1 w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm text-neutral-400">Phone</span>
            <input
              type="text"
              value={content.contact.phoneNo}
              onChange={(e) => updateContact({ phoneNo: e.target.value })}
              className="mt-1 w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm text-neutral-400">Location / Domicile</span>
            <input
              type="text"
              value={content.contact.domicile}
              onChange={(e) => updateContact({ domicile: e.target.value })}
              className="mt-1 w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-2"
            />
          </label>
        </section>

        {/* Experiences */}
        <section className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-neutral-700 pb-2">
            Experiences
          </h2>
          {content.experiences.map((exp, i) => (
            <div key={i} className="rounded-lg border border-neutral-700 p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-500">Experience {i + 1}</span>
                <button
                  type="button"
                  onClick={() =>
                    setExperiences(content.experiences.filter((_, j) => j !== i))
                  }
                  className="text-red-400 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
              <input
                placeholder="Year"
                value={exp.year}
                onChange={(e) => {
                  const next = [...content.experiences];
                  next[i] = { ...next[i], year: e.target.value };
                  setExperiences(next);
                }}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm"
              />
              <input
                placeholder="Role"
                value={exp.role}
                onChange={(e) => {
                  const next = [...content.experiences];
                  next[i] = { ...next[i], role: e.target.value };
                  setExperiences(next);
                }}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm"
              />
              <input
                placeholder="Company"
                value={exp.company}
                onChange={(e) => {
                  const next = [...content.experiences];
                  next[i] = { ...next[i], company: e.target.value };
                  setExperiences(next);
                }}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm"
              />
              <textarea
                placeholder="Description"
                value={exp.description}
                onChange={(e) => {
                  const next = [...content.experiences];
                  next[i] = { ...next[i], description: e.target.value };
                  setExperiences(next);
                }}
                rows={3}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm resize-y"
              />
              <input
                placeholder="Technologies (comma-separated)"
                value={exp.technologies.join(", ")}
                onChange={(e) => {
                  const next = [...content.experiences];
                  next[i] = {
                    ...next[i],
                    technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  };
                  setExperiences(next);
                }}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setExperiences([
                ...content.experiences,
                {
                  year: "",
                  role: "",
                  company: "",
                  description: "",
                  technologies: [],
                },
              ])
            }
            className="rounded-lg border border-dashed border-neutral-600 px-4 py-2 text-sm text-neutral-400 hover:border-purple-500 hover:text-purple-400"
          >
            + Add experience
          </button>
        </section>

        {/* Certifications */}
        <section className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-neutral-700 pb-2">
            Certifications
          </h2>
          {content.certifications.map((cert, i) => (
            <div key={i} className="rounded-lg border border-neutral-700 p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500">Cert {i + 1}</span>
                <button
                  type="button"
                  onClick={() =>
                    setCertifications(content.certifications.filter((_, j) => j !== i))
                  }
                  className="text-red-400 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
              <input
                placeholder="Year"
                value={cert.year}
                onChange={(e) => {
                  const next = [...content.certifications];
                  next[i] = { ...next[i], year: e.target.value };
                  setCertifications(next);
                }}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm"
              />
              <input
                placeholder="Role / Title"
                value={cert.role}
                onChange={(e) => {
                  const next = [...content.certifications];
                  next[i] = { ...next[i], role: e.target.value };
                  setCertifications(next);
                }}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm"
              />
              <input
                placeholder="Company / Issuer"
                value={cert.company}
                onChange={(e) => {
                  const next = [...content.certifications];
                  next[i] = { ...next[i], company: e.target.value };
                  setCertifications(next);
                }}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm"
              />
              <textarea
                placeholder="Description"
                value={cert.description}
                onChange={(e) => {
                  const next = [...content.certifications];
                  next[i] = { ...next[i], description: e.target.value };
                  setCertifications(next);
                }}
                rows={2}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm resize-y"
              />
              <input
                placeholder="Technologies (comma-separated)"
                value={cert.technologies.join(", ")}
                onChange={(e) => {
                  const next = [...content.certifications];
                  next[i] = {
                    ...next[i],
                    technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  };
                  setCertifications(next);
                }}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setCertifications([
                ...content.certifications,
                { year: "", role: "", company: "", description: "", technologies: [] },
              ])
            }
            className="rounded-lg border border-dashed border-neutral-600 px-4 py-2 text-sm text-neutral-400 hover:border-purple-500 hover:text-purple-400"
          >
            + Add certification
          </button>
        </section>

        {/* Organizations */}
        <section className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-neutral-700 pb-2">
            Organizations
          </h2>
          {content.organizations.map((org, i) => (
            <div key={i} className="rounded-lg border border-neutral-700 p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-neutral-500">Org {i + 1}</span>
                <button
                  type="button"
                  onClick={() =>
                    setOrganizations(content.organizations.filter((_, j) => j !== i))
                  }
                  className="text-red-400 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
              <input
                placeholder="Year"
                value={org.year}
                onChange={(e) => {
                  const next = [...content.organizations];
                  next[i] = { ...next[i], year: e.target.value };
                  setOrganizations(next);
                }}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm"
              />
              <input
                placeholder="Role"
                value={org.role}
                onChange={(e) => {
                  const next = [...content.organizations];
                  next[i] = { ...next[i], role: e.target.value };
                  setOrganizations(next);
                }}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm"
              />
              <input
                placeholder="Company / Org name"
                value={org.company}
                onChange={(e) => {
                  const next = [...content.organizations];
                  next[i] = { ...next[i], company: e.target.value };
                  setOrganizations(next);
                }}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm"
              />
              <textarea
                placeholder="Description"
                value={org.description}
                onChange={(e) => {
                  const next = [...content.organizations];
                  next[i] = { ...next[i], description: e.target.value };
                  setOrganizations(next);
                }}
                rows={2}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm resize-y"
              />
              <input
                placeholder="Technologies / tags (comma-separated)"
                value={org.technologies.join(", ")}
                onChange={(e) => {
                  const next = [...content.organizations];
                  next[i] = {
                    ...next[i],
                    technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  };
                  setOrganizations(next);
                }}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setOrganizations([
                ...content.organizations,
                { year: "", role: "", company: "", description: "", technologies: [] },
              ])
            }
            className="rounded-lg border border-dashed border-neutral-600 px-4 py-2 text-sm text-neutral-400 hover:border-purple-500 hover:text-purple-400"
          >
            + Add organization
          </button>
        </section>

        {/* Projects */}
        <section className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-neutral-700 pb-2">
            Projects
          </h2>
          {content.projects.map((proj, i) => (
            <div key={i} className="rounded-lg border border-neutral-700 p-4 space-y-3">
              <div className="flex justify-between items-start gap-4">
                <span className="text-sm text-neutral-500">Project {i + 1}</span>
                <button
                  type="button"
                  onClick={() =>
                    setProjects(content.projects.filter((_, j) => j !== i))
                  }
                  className="text-red-400 text-sm hover:underline shrink-0"
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={proj.image}
                  alt=""
                  className="w-20 h-20 rounded object-cover border border-neutral-700"
                />
                <div className="flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => uploadFile("project", i)}
                    className="rounded bg-purple-700 px-2 py-1 text-xs hover:bg-purple-600"
                  >
                    Upload image
                  </button>
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={proj.image}
                    onChange={(e) => {
                      const next = [...content.projects];
                      next[i] = { ...next[i], image: e.target.value };
                      setProjects(next);
                    }}
                    className="mt-1 w-full rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm"
                  />
                </div>
              </div>
              <input
                placeholder="Project title"
                value={proj.title.text}
                onChange={(e) => {
                  const next = [...content.projects];
                  next[i] = {
                    ...next[i],
                    title: { ...next[i].title, text: e.target.value },
                  };
                  setProjects(next);
                }}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm"
              />
              <input
                placeholder="Project link (optional)"
                value={proj.title.link ?? ""}
                onChange={(e) => {
                  const next = [...content.projects];
                  next[i] = {
                    ...next[i],
                    title: { ...next[i].title, link: e.target.value || undefined },
                  };
                  setProjects(next);
                }}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm"
              />
              <textarea
                placeholder="Description"
                value={proj.description}
                onChange={(e) => {
                  const next = [...content.projects];
                  next[i] = { ...next[i], description: e.target.value };
                  setProjects(next);
                }}
                rows={2}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm resize-y"
              />
              <input
                placeholder="Technologies (comma-separated)"
                value={proj.technologies.join(", ")}
                onChange={(e) => {
                  const next = [...content.projects];
                  next[i] = {
                    ...next[i],
                    technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  };
                  setProjects(next);
                }}
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setProjects([
                ...content.projects,
                {
                  title: { text: "" },
                  image: "",
                  description: "",
                  technologies: [],
                },
              ])
            }
            className="rounded-lg border border-dashed border-neutral-600 px-4 py-2 text-sm text-neutral-400 hover:border-purple-500 hover:text-purple-400"
          >
            + Add project
          </button>
        </section>

        <div className="sticky bottom-4 flex justify-end">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-xl bg-purple-700 px-6 py-3 font-medium text-white hover:bg-purple-600 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save all content"}
          </button>
        </div>
      </div>
    </div>
  );
}
