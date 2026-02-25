// Project images: place project-1.png, project-2.jpg, project-3.jpg, project-4.jpg, project-bati.png in public/projects/

export const NAME = "Calvin Hendra";
export const NICKNAME = "Calvin";
export const POSITION = "Software Engineer";
export const HERO_CONTENT = `Final-year Computer Science student and Software Engineer Intern with hands-on experience delivering end-to-end applications in a fintech and AI-driven environment. Experienced in backend systems, API development, database design, AI-powered integration, and frontend development for building complete, production-ready applications. Comfortable working on complex problem-solving tasks, debugging system-level issues, and collaborating in team-based development to deliver reliable solutions.`;

export const EXPERIENCES = [
  {
    year: "February 2026 - Present",
    role: "Software Engineer",
    company: "PT Bati Investasi Teknologi",
    description: `
Led the development and maintenance of a widget-based AI sales agent embedded into client websites to support user acquisition and conversion.

Owned full-stack feature development, including LLM-based workflows using Retrieval-Augmented Generation (RAG), along with system observability through tracing and monitoring.

Collaborated closely with product and business teams to align AI behavior with financial domain constraints and sales objectives.
    `,
    technologies: [
      "TypeScript",
      "Next.js",
      "React",
      "Tailwind CSS",
      "Python",
      "FastAPI",
      "LangChain",
      "RAG",
      "PostgreSQL",
      "Vector Databases",
    ],
  },
  {
    year: "February 2025 - February 2026",
    role: "Software Engineer Intern",
    company: "PT Bati Investasi Teknologi",
    description: `
  Contributed to the development of Bati's AI Wealth Management platform and the early-stage AI sales agent as part of the engineering team.
  Worked on full-stack web features, backend APIs, and initial RAG pipelines supporting both internal wealth tools and client-facing experiences.
  Collaborated with the trading team to support data workflows and internal tools used for financial analysis and modeling.
    `,
    technologies: [
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Python",
      "FastAPI",
      "PostgreSQL",
    ],
  },
];

export const CERTIFICATIONS = [
  {
    year: "May 2024",
    role: "Certified Backend Developer with Node.js",
    company: "BINUS Center",
    description: `Earned certification in backend development by completing an intensive program focused on Mastering Backend Development with Node.js. Demonstrated expertise in server-side development, RESTful API design, database integration using Sequelize ORM, and middleware implementation through a rigorous assessment process.`,
    technologies: ["Node.js", "Express.js", "Sequelize", "MySQL", "REST API"],
  },
];

export const ORGANIZATIONS = [
  {
    year: "Nov 2023 – July 2024",
    role: "Member",
    company: "Google Developer Student Club ",
    description: `Participated in training sessions organised by the club, gaining valuable skills in both technical and non-technical areas`,
    technologies: ["Coding"],
  },
  {
    year: "Mar 2023 — Jan 2024",
    role: "Creative Design Activist",
    company: "Keluarga Mahasiswa Buddhis Dhammavaddhana",
    description: `Designed posters for social media platforms using design tools to enhance promotional materials' visual appeal and Collaborated with the marketing team to ensure designs aligned with organisational branding and messaging.`,
    technologies: ["Design", "Canva", "Photoshop", "Collaboration", "Teamwork"],
  },
  {
    year: "Nov 2022 – Sept 2023",
    role: "Activist",
    company: "Bina Nusantara Computer Club",
    description: `Coordinated with team members to develop and execute impactful work programs, ensuring successful implementation and participated in training sessions organised by the club, enhancing hard skills and soft skills`,
    technologies: [
      "Public Speaking",
      "Coding",
      "Design",
      "Teamwork",
      "Collaboration",
    ],
  },
];

export type ProjectTitle = { text: string; link?: string };

export const PROJECTS: {
  title: ProjectTitle;
  image: string;
  description: string;
  technologies: string[];
}[] = [
  {
    title: {
      text: "Bati WealthAI",
      // link: "https://wealthplatform.batiinvestasi.ai",
    },
    image: "/project-bati.png",
    description:
      "Responsible for the development of Bati WealthAI, an intelligent web based CRM for relationship manager to grow their portfolio with Bati AI integration.",
    technologies: [
      "TypeScript",
      "React.js",
      "Next.js",
      "TailwindCSS",
      "Node.js",
      "Express.js",
      "PostgreSQL",
    ],
  },
  {
    title: {
      text: "MulaiDulu",
      // link: "https://mulaidulu.site",
    },
    image: "/project-1.png",
    description:
      "Led the development of MulaiDulu, a coaching platform aimed at empowering MSMEs and individuals to grow their businesses.",
    technologies: ["HTML", "Bootstrap", "Laravel", "MySQL"],
  },
  {
    title: {
      text: "MakanGak",
      // link: "https://makan-gak-app-fullstack.vercel.app",
    },
    image: "/project-2.jpg",
    description:
      "Led the development of MakanGak, a website on food options around Binus University, to assist new students in finding meals.",
    technologies: ["HTML", "CSS", "JavaScript", "ReactJs", "NodeJs", "MySQL"],
  },
  {
    title: {
      text: "GymMe",
    },
    image: "/project-3.jpg",
    description:
      "A dynamic e-commerce website specialising in supplement sales.",
    technologies: ["HTML", "CSS", "C#", "ASP.NET"],
  },
  {
    title: {
      text: "Sea of FTars",
    },
    image: "/project-4.jpg",
    description: "Frontend of a interactive and responsive gaming website.",
    technologies: ["HTML", "CSS", "JavaScript"],
  },
];

export const CONTACT = {
  domicile: "West Jakarta",
  phoneNo: "+6281265571198",
  email: "calvinhendra330@gmail.com",
};
