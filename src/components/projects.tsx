"use client";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { fadeUp, pad, Section, TagLine } from "@/components/section";
import { useContent } from "@/hooks";
import type { Project } from "@/types/content";

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const link = project.title.link;
  const body = (
    <div className="grid gap-5 py-8 lg:grid-cols-[4rem_1fr] lg:gap-8">
      <span className="font-mono text-xs text-accent lg:pt-3">
        {pad(index + 1)}
      </span>
      <div>
        <h3 className="flex items-start gap-3 font-serif text-4xl leading-[1.05] text-ink sm:text-5xl">
          <span>{project.title.text}</span>
          {link && (
            <FiArrowUpRight className="mt-2 h-6 w-6 shrink-0 text-muted transition-colors group-hover:text-accent" />
          )}
        </h3>
        <p className="mt-4 max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-muted">
          {project.description}
        </p>
        <div className="mt-5">
          <TagLine tags={project.technologies} />
        </div>
      </div>
    </div>
  );

  return (
    <motion.li
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="group border-b border-rule"
    >
      {link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {body}
        </a>
      ) : (
        body
      )}
    </motion.li>
  );
}

const Projects = ({ index: sectionIndex }: { index: number }) => {
  const { content } = useContent();
  return (
    <Section
      id="work"
      index={sectionIndex}
      label="Selected work"
      title={
        <>
          Things I&apos;ve <em className="italic">built</em>
        </>
      }
      count={content.projects.length}
    >
      <ol className="border-t border-rule">
        {content.projects.map((project, index) => (
          <ProjectRow
            key={project.title.text}
            project={project}
            index={index}
          />
        ))}
      </ol>
    </Section>
  );
};

export default Projects;
