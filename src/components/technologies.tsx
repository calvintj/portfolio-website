"use client";
import { motion } from "framer-motion";
import type { IconType } from "react-icons";
import { RiNextjsFill } from "react-icons/ri";
import { SiExpress, SiFastapi, SiMysql, SiTailwindcss } from "react-icons/si";
import { Section, SectionHeading } from "@/components/section";

type Tech = { name: string } & (
  | { src: string; Icon?: never }
  | { Icon: IconType; src?: never }
);

const technologies: Tech[] = [
  { name: "JavaScript", src: "/js.svg" },
  { name: "TypeScript", src: "/ts.svg" },
  { name: "Python", src: "/python.svg" },
  { name: "FastAPI", Icon: SiFastapi },
  { name: "Next.js", Icon: RiNextjsFill },
  { name: "React", src: "/react.svg" },
  { name: "Tailwind CSS", Icon: SiTailwindcss },
  { name: "Node.js", src: "/nodejs.svg" },
  { name: "Express", Icon: SiExpress },
  { name: "PostgreSQL", src: "/postgresql.svg" },
  { name: "MySQL", Icon: SiMysql },
  { name: "Docker", src: "/docker.svg" },
  { name: "AWS", src: "/aws.svg" },
];

const Technologies = () => {
  return (
    <Section id="technologies">
      <SectionHeading label="Stack" title="Technologies" />
      <div className="flex flex-wrap gap-3">
        {technologies.map((tech, index) => (
          <motion.div
            key={tech.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: index * 0.04, ease: "easeOut" }}
            className="flex items-center gap-2.5 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 transition-colors hover:border-zinc-600"
          >
            {tech.Icon ? (
              <tech.Icon className="h-5 w-5 text-zinc-300" />
            ) : (
              <img src={tech.src} alt="" className="h-5 w-5 object-contain" />
            )}
            <span className="text-sm text-zinc-300">{tech.name}</span>
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export default Technologies;
