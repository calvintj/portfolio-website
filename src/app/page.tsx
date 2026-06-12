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
    <div className="relative min-h-screen overflow-x-hidden antialiased">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[#0a0a0c]" />
        <div className="absolute left-1/2 top-0 h-[32rem] w-[56rem] -translate-x-1/2 rounded-full bg-teal-500/[0.07] blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black_40%,transparent_100%)]" />
      </div>

      <Navbar />
      <main className="mx-auto max-w-4xl px-6 lg:px-8">
        <Hero />
        <Technologies />
        <Experience />
        <Projects />
        <Certification />
        <Organization />
        <Contact />
      </main>
      <Chatbot />
    </div>
  );
};

export default App;
