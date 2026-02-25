"use client";
import { motion } from "framer-motion";
import { useContent } from "@/hooks";

const Contact = () => {
  const { content } = useContent();
  return (
    <div className="border-b border-neutral-900 pb-20">
      <motion.h1
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 0.5 }}
        className="my-10 text-center text-4xl font-bold"
      >
        Get in Touch
      </motion.h1>
      <motion.div
        whileInView={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: -100 }}
        transition={{ duration: 1 }}
        className="text-center tracking-tighter"
      >
        <p className="my-4">{content.contact.domicile}</p>
        <a href={`mailto:${content.contact.email}`} className="border-b">
          {content.contact.email}
        </a>
      </motion.div>
    </div>
  );
};

export default Contact;
