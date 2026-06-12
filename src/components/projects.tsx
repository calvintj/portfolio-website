"use client";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { Section, SectionHeading, TagList } from "@/components/section";
import { useContent } from "@/hooks";
import type { Project } from "@/types/content";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const card = (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: (index % 2) * 0.1,
        ease: "easeOut",
      }}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 transition-colors hover:border-zinc-600"
    >
      <div className="relative aspect-[2/1] overflow-hidden border-b border-zinc-800/60 bg-zinc-900/80">
        {project.imageFit === "contain" ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(94,234,212,0.08),transparent_70%)]" />
            <img
              src={project.image}
              alt={project.title.text}
              className="relative h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </>
        ) : (
          <img
            src={project.image}
            alt={project.title.text}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="flex items-start justify-between gap-2 text-lg font-medium text-zinc-100">
          {project.title.text}
          {project.title.link && (
            <FiArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-zinc-500 transition-colors group-hover:text-teal-300" />
          )}
        </h3>
        <p className="mt-3 flex-1 text-[15px] leading-relaxed text-zinc-400">
          {project.description}
        </p>
        <TagList tags={project.technologies} />
      </div>
    </motion.article>
  );

  return project.title.link ? (
    <a href={project.title.link} target="_blank" rel="noopener noreferrer">
      {card}
    </a>
  ) : (
    card
  );
}

const Projects = () => {
  const { content } = useContent();
  return (
    <Section id="projects">
      <SectionHeading label="Work" title="Projects" />
      <div className="grid gap-6 sm:grid-cols-2">
        {content.projects.map((project, index) => (
          <ProjectCard
            key={project.title.text}
            project={project}
            index={index}
          />
        ))}
      </div>
    </Section>
  );
};

export default Projects;
