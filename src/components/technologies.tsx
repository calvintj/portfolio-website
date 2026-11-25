"use client";
import type { IconType } from "react-icons";
import { RiNextjsFill } from "react-icons/ri";
import { SiExpress, SiFastapi, SiMysql, SiTailwindcss } from "react-icons/si";

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

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center"
    >
      {technologies.map((tech) => (
        <li key={tech.name} className="flex items-center gap-4 px-6 sm:px-8">
          {tech.Icon ? (
            <tech.Icon className="h-7 w-7 text-ink" />
          ) : (
            <img src={tech.src} alt="" className="h-7 w-7 object-contain" />
          )}
          <span className="whitespace-nowrap font-serif text-4xl text-ink sm:text-5xl">
            {tech.name}
          </span>
          <span aria-hidden className="pl-6 text-2xl text-accent sm:pl-8">
            ✳
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Full-bleed ticker of the stack; the second copy makes the loop seamless. */
const Technologies = () => {
  return (
    <section
      id="technologies"
      aria-label="Technologies"
      className="marquee-wrap mt-12 overflow-hidden border-y border-rule py-6"
    >
      <h2 className="sr-only">Technologies</h2>
      <div className="marquee flex w-max">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
};

export default Technologies;
