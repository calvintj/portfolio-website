import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Technologies from "@/components/technologies";
import Experience from "@/components/experience";
import Certification from "@/components/certification";
import Organization from "@/components/organization";
import Projects from "@/components/projects";
import Contact from "@/components/contact";
import Chatbot from "@/components/chatbot";

export const App = () => {
  return (
    <div className="overflow-x-hidden text-neutral-300 antialiased selection:bg-cyan-300 selection:text-cyan-900">
      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>{" "}
      </div>
      <div className="container mx-auto px-12 lg:px-0">
        <Navbar />
        <Hero />
        <Technologies />
        <Experience />
        <Certification />
        <Organization />
        <Projects />
        <Contact />
        <Chatbot />
      </div>
    </div>
  );
};

export default App;
