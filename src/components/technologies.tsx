"use client";
import { SiMysql, SiExpress, SiTailwindcss, SiFastapi } from "react-icons/si";
import { RiNextjsFill } from "react-icons/ri";
import { motion } from "framer-motion";

// Keyframes approximating a cosine wave: smooth rise and fall
const iconVariants = (duration: number) => ({
  initial: { y: 0 },
  animate: {
    y: [0, 7, 10, 7, 0, -7, -10, -7, 0],
    transition: {
      duration: duration,
      ease: "linear" as const,
      repeat: Infinity,
      repeatType: "loop" as const,
    },
  },
});

const Technologies = () => {
  return (
    <div className="border-b border-neutral-800 pb-24">
      <motion.h1
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: -100 }}
        transition={{ duration: 1.5 }}
        className="my-20 text-center text-4xl font-bold"
      >
        Technologies
      </motion.h1>
      <motion.div
        whileInView={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: -100 }}
        transition={{ duration: 1.5 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        {/* JavaScript */}
        <motion.div
          variants={iconVariants(2)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4"
        >
          <img
            src="/js.svg"
            alt="JavaScript"
            className="w-16 h-16 object-contain"
          />
        </motion.div>
        {/* TypeScript */}
        <motion.div
          variants={iconVariants(2.5)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4"
        >
          <img
            src="/ts.svg"
            alt="JavaScript"
            className="w-16 h-16 object-contain"
          />{" "}
        </motion.div>

        {/* Python */}
        <motion.div
          variants={iconVariants(3)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4 flex items-center justify-center"
        >
          <img
            src="/python.svg"
            alt="Python"
            className="w-16 h-16 object-contain"
          />
        </motion.div>
        {/* FastAPI */}
        <motion.div
          variants={iconVariants(3.5)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4"
        >
          <SiFastapi className="text-7xl text-yellow-400" />
        </motion.div>

        {/* Next.js */}
        <motion.div
          variants={iconVariants(4)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4"
        >
          <RiNextjsFill className="text-7xl text-blue-400" />
        </motion.div>

        {/* ReactJs */}
        <motion.div
          variants={iconVariants(3.5)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4"
        >
          <img
            src="/react.svg"
            alt="ReactJs"
            className="w-16 h-16 object-contain"
          />{" "}
        </motion.div>

        {/* TailwindCSS */}
        <motion.div
          variants={iconVariants(3)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4"
        >
          <SiTailwindcss className="text-7xl text-cyan-400" />
        </motion.div>

        {/* NodeJs */}
        <motion.div
          variants={iconVariants(2.5)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4"
        >
          <img
            src="/nodejs.svg"
            alt="NodeJs"
            className="w-16 h-16 object-contain"
          />
        </motion.div>

        {/* Express.js */}
        <motion.div
          variants={iconVariants(2)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4"
        >
          <SiExpress className="text-7xl text-orange-600" />
        </motion.div>

        {/* PostgreSQL */}
        <motion.div
          variants={iconVariants(2.5)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4"
        >
          <img
            src="/postgresql.svg"
            alt="PostgreSQL"
            className="w-16 h-16 object-contain"
          />
        </motion.div>

        {/* MySQL */}
        <motion.div
          variants={iconVariants(3)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4"
        >
          <SiMysql className="text-7xl text-blue-600" />
        </motion.div>

        {/* Docker */}
        <motion.div
          variants={iconVariants(3.5)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4"
        >
          <img
            src="/docker.svg"
            alt="Docker"
            className="w-16 h-16 object-contain"
          />
        </motion.div>

        {/* AWS */}
        <motion.div
          variants={iconVariants(4)}
          initial="initial"
          animate="animate"
          className="rounded-2xl border-4 border-neutral-800 p-4"
        >
          <img src="/aws.svg" alt="AWS" className="w-16 h-16 object-contain" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Technologies;
