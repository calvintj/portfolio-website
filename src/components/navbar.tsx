import { FaEnvelope, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";

const links = [
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const socials = [
  {
    href: "https://www.linkedin.com/in/calvinhendra",
    label: "LinkedIn",
    Icon: FaLinkedin,
  },
  { href: "https://github.com/calvintj", label: "GitHub", Icon: FaGithub },
  {
    href: "https://www.instagram.com/calvintjj",
    label: "Instagram",
    Icon: FaInstagram,
  },
  {
    href: "mailto:calvinhendra330@gmail.com",
    label: "Email",
    Icon: FaEnvelope,
  },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0c]/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6 lg:px-8">
        <a
          href="#top"
          className="font-mono text-sm font-medium tracking-tight text-zinc-100"
        >
          calvin<span className="text-teal-300">.hendra</span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              className="text-zinc-400 transition-colors hover:text-teal-300"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
