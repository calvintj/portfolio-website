import type { Content } from "@/types/content";
import {
  NAME,
  NICKNAME,
  POSITION,
  HERO_CONTENT,
  EXPERIENCES,
  PROJECTS,
  CONTACT,
  CERTIFICATIONS,
  ORGANIZATIONS,
} from "@/constants";

/** Client-safe: no Node.js APIs. Used by ContentContext and as fallback. */
export function getDefaultContent(): Content {
  return {
    profileImage: "/profilePic.jpg",
    name: NAME,
    nickname: NICKNAME,
    position: POSITION,
    heroContent: HERO_CONTENT,
    experiences: EXPERIENCES.map((e) => ({ ...e })),
    certifications: CERTIFICATIONS.map((c) => ({ ...c })),
    organizations: ORGANIZATIONS.map((o) => ({ ...o })),
    projects: PROJECTS.map((p) => ({
      ...p,
      title: { ...p.title },
    })),
    contact: { ...CONTACT },
  };
}
