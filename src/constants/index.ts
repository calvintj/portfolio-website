// Build-time default content. Keep in sync with data/content.json,
// which is what the live site serves.

export const NAME = "Calvin Hendra";
export const NICKNAME = "Calvin";
export const POSITION = "Software Engineer & AI Engineer";
export const HERO_CONTENT =
  "Software and AI engineer who turns business problems into production AI products, from a sales assistant on live Shopify stores to a legal case platform for a mining company. Nearly two years shipping end to end across LLM applications, backend APIs, web apps and cloud infrastructure. Thrives in fast-moving startup environments and consistently delivers production-ready work with measurable business impact.";

export const CV_URL =
  "https://docs.google.com/document/d/1s-pXdsFw3TXNT8wPUEWXIGIXaIY6X9fvZg_muX5plJA/edit";

export const EXPERIENCES = [
  {
    year: "September 2026 - Present",
    role: "IT Consultant",
    company: "PT Merge Mining Industri",
    description:
      "IT consultant for a coal mining company, responsible for its application server and internal business systems.\n\n• Designed and developed the Legal Matter Tracker, an AI-powered case management platform that replaced manual document review for the legal team, summarising a 188-document case in 9 minutes at about $1.27 in AI cost.\n• Re-architected the company server onto a containerised platform with nightly off-site backups, hardened access controls and one-command releases with rollback, removing the company's dependence on a single person to operate its systems.",
    technologies: [
      "Next.js",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Claude API",
      "Docker",
      "Cloudflare",
    ],
  },
  {
    year: "January 2026 - Present",
    role: "Software Engineer",
    company: "PT Bati Investasi Teknologi",
    description:
      "Software engineer on Bati's AI products for e-commerce and financial services, owning features end to end from AI pipelines to deployment.\n\n• Shipped Bati Agent, an AI sales assistant embedded in 3 live Shopify storefronts, delivering a 30–40% conversion uplift for the first client across ~10,000 daily sessions.\n• Developed the new web application for Clever, an AI-driven WhatsApp cross-sell platform piloted with Moladin, Kredit Pintar and Bank Saqu.\n• Built BatiLabs Web, the company website and self-service merchant onboarding portal with Shopify integration and Xendit payments.\n• Managed deployment and operations for all services on AWS, including CI/CD pipelines and DNS.",
    technologies: [
      "Python",
      "FastAPI",
      "TypeScript",
      "Next.js",
      "React",
      "LangChain",
      "Qdrant",
      "PostgreSQL",
      "ClickHouse",
      "Redis",
      "Claude API",
      "Docker",
      "AWS",
      "GitHub Actions",
      "Shopify API",
    ],
  },
  {
    year: "February 2025 - January 2026",
    role: "Software Engineer Intern",
    company: "PT Bati Investasi Teknologi",
    description:
      "Software engineering intern on Bati's AI and wealth management products.\n\n• Built an AI financing sales chatbot that answers customer questions on vehicle installments, loans and foreign currency, combining retrieval over product documents with real-time financial calculations to give instant quotes without waiting for a sales agent.\n• Developed Bati WealthAI, a CRM for relationship managers with secure authentication, role-based access and portfolio dashboards.",
    technologies: [
      "Python",
      "FastAPI",
      "TypeScript",
      "Next.js",
      "React",
      "LangChain",
      "RAG",
      "Qdrant",
      "PostgreSQL",
      "Node.js",
      "Docker",
      "Supabase",
    ],
  },
];

export const CERTIFICATIONS = [
  {
    year: "May 2026",
    role: "Financial Markets",
    company: "Yale University — Coursera",
    description:
      "Covered financial markets, risk management, behavioural finance and investment principles, supporting product work in fintech and lending.",
    technologies: ["Financial Markets", "Risk Management", "Investment"],
  },
  {
    year: "May 2024",
    role: "Mastering Backend Development with Node.js",
    company: "BINUS Center",
    description:
      "Certified in backend development, covering RESTful API design, database integration with Sequelize ORM, authentication and middleware.",
    technologies: ["Node.js", "Express.js", "Sequelize", "MySQL", "REST API"],
  },
  {
    year: "February 2023",
    role: "ITversity Certification",
    company: "Course-Net",
    description:
      "Completed Course-Net's ITversity certification program, covering core IT and software development fundamentals.",
    technologies: ["Data Structures", "Algorithms"],
  },
];

export const ORGANIZATIONS = [
  {
    year: "Mar 2023 — Jan 2024",
    role: "Creative Design Activist",
    company: "Keluarga Mahasiswa Buddhis Dhammavaddhana",
    description:
      "Designed social media posters for the organisation's programmes, working with the marketing team to keep every design consistent with its branding and messaging.",
    technologies: ["Design", "Canva", "Photoshop", "Collaboration", "Teamwork"],
  },
  {
    year: "Nov 2022 – Sept 2023",
    role: "Activist",
    company: "Bina Nusantara Computer Club",
    description:
      "Planned and delivered the club's work programs with a cross-functional team, and took part in technical and soft-skills training.",
    technologies: ["Teamwork", "Collaboration", "Coding", "Public Speaking"],
  },
];

export type ProjectTitle = { text: string; link?: string };

export const PROJECTS: {
  title: ProjectTitle;
  description: string;
  technologies: string[];
}[] = [
  {
    title: {
      text: "Clever — AI Cross-Sell Platform",
    },
    description:
      "AI-driven cross-sell platform for financial institutions including Moladin, Kredit Pintar and Bank Saqu. Lenders hold large customer bases but struggle to know which product to offer each customer, and when. Clever picks the best offer for each customer, sends it over WhatsApp, and manages the follow-up conversation with an AI agent grounded in the customer's profile, the product catalogue and the client's business rules, handing qualified leads to sales officers.\n\n• Built the new web application: a performance dashboard by business goal, a live WhatsApp inbox with media support, lead routing to sales officers, and consent and privacy controls.\n• Leading the migration from per-client deployments to a single multi-tenant platform with isolated client data and one release process.",
    technologies: [
      "TypeScript",
      "React",
      "Bun",
      "Hono",
      "WhatsApp API",
      "LLM",
      "Docker",
    ],
  },
  {
    title: {
      text: "Legal Matter Tracker",
    },
    description:
      "AI-powered case management platform for MMI's legal team. Before it, every legal document was reviewed and summarised by hand, and there was no shared system to track cases. The platform takes in case documents in bulk, analyses each one with Claude, and produces case summaries with the current status, the recommended next action and page-level citations, plus a Q&A assistant for each case.\n\n• Summarises a 188-document case in 9 minutes for about $1.27 in AI cost.\n• Found all 10 known issues in a 42-file validation case before launch.\n• Live with 12 cases and 190 documents; bilingual (Indonesian/English), mobile-ready, with configurable AI cost controls.",
    technologies: [
      "Next.js",
      "FastAPI",
      "Python",
      "PostgreSQL",
      "LLM",
      "Docker",
    ],
  },
  {
    title: {
      text: "Bati Agent — AI Sales Assistant",
    },
    description:
      "AI sales assistant embedded into Shopify storefronts including Kami Idea, Russ Simple Life, and Lozy. Shoppers often fail to find the right product through keyword search, especially when they describe what they need instead of a product name. Bati Agent understands natural-language questions, searches the catalogue by meaning, and recommends products in a chat widget installed with a single script.\n\n• Delivered a 30–40% conversion uplift for the first client across ~10,000 daily sessions.\n• Live on 3 storefronts, with a multi-tenant admin dashboard for each merchant.",
    technologies: [
      "Python",
      "FastAPI",
      "Next.js",
      "LangChain",
      "Qdrant",
      "PostgreSQL",
      "ClickHouse",
      "Redis",
      "AWS",
      "Shopify API",
      "Docker",
    ],
  },
  {
    title: {
      text: "BatiLabs Web",
      link: "https://batilabs.ai",
    },
    description:
      "Company website and merchant onboarding portal for BatiLabs. Turns onboarding into a single self-service flow: merchants connect their Shopify store, install the Bati Agent script and pay through Xendit without help from the team. Deployed on AWS S3 behind Cloudflare.",
    technologies: [
      "TypeScript",
      "React",
      "Vite",
      "Tailwind CSS",
      "FastAPI",
      "PostgreSQL",
      "AWS S3",
      "Cloudflare",
      "Docker",
      "Xendit",
    ],
  },
  {
    title: {
      text: "Bati WealthAI",
    },
    description:
      "CRM for Bati's relationship managers to manage client portfolios and sales pipelines in one place, with AI-assisted insights. Built secure authentication, role-based access and portfolio dashboards that give each manager a live view of their clients.",
    technologies: ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Docker"],
  },
  {
    title: {
      text: "Vaultbook — Personal Finance App",
    },
    description:
      "Personal project. A personal finance app that brings assets, liabilities, income, expenses and net worth into one dashboard, keeping cash, investments, gold, foreign currency, debts and loans in one place instead of scattered across spreadsheets.\n\n• Net worth dashboard with financial health ratios (debt-to-asset, emergency runway, savings rate) and automatic monthly snapshots.\n• Debt payoff projections with avalanche and snowball strategies, and one-click refresh of live gold and exchange-rate prices.\n• Self-hosted with Docker behind Cloudflare Access for zero-trust sign-in.",
    technologies: [
      "TypeScript",
      "Next.js",
      "PostgreSQL",
      "Tailwind CSS",
      "Recharts",
      "Docker",
      "Cloudflare Access",
    ],
  },
  {
    title: {
      text: "Thrive — Training & Recovery Tracker",
    },
    description:
      "Personal project. Turns Garmin watch data into progress toward personal health goals: recovery (sleep, HRV, resting heart rate, stress), training toward a 5K, strength sessions, body measurements and lab follow-ups, with a monthly report.\n\n• AI coach that writes a weekly check-in and answers questions about the data, running on Claude or an open model on DeepInfra, with per-user AI spend tracking.\n• A Python worker syncs Garmin data automatically; multi-user behind Cloudflare Access.",
    technologies: [
      "TypeScript",
      "Next.js",
      "PostgreSQL",
      "Python",
      "LLM",
      "Docker",
      "Cloudflare Access",
    ],
  },
  {
    title: {
      text: "MulaiDulu",
    },
    description:
      "Coaching platform that helps MSMEs and individuals grow their businesses. Led the development of the web application.",
    technologies: ["Bootstrap", "Laravel", "MySQL"],
  },
];

export const CONTACT = {
  domicile: "DKI Jakarta",
  email: "calvinhendra330@gmail.com",
};
