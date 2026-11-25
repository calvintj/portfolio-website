import Certification from "@/components/certification";
import Chatbot from "@/components/chatbot";
import Contact from "@/components/contact";
import Experience from "@/components/experience";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Organization from "@/components/organization";
import Projects from "@/components/projects";
import Technologies from "@/components/technologies";

export const App = () => {
  return (
    <div className="relative min-h-screen overflow-x-clip antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Technologies />
        <Projects index={1} />
        <Experience index={2} />
        <Certification index={3} />
        <Organization index={4} />
      </main>
      <Contact index={5} />
      <Chatbot />
    </div>
  );
};

export default App;
