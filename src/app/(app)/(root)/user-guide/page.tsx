"use client";

import { buildSrc, Video } from "@imagekit/next";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { BookOpen } from "lucide-react";
import { useRef } from "react";

export default function UserGuidePage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden px-4 py-8 text-foreground"
    >
      <motion.div
        className="absolute top-20 left-10 h-64 w-64 rounded-full bg-[#88734C]/5 blur-3xl"
        style={{ y: y1, rotate: rotate1 }}
      />
      <motion.div
        className="absolute right-10 bottom-20 h-80 w-80 rounded-full bg-[#A9BBC8]/5 blur-3xl"
        style={{ y: y2, rotate: rotate2 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/4 h-4 w-4 rounded-full bg-[#88734C]/30"
        animate={{
          y: [0, -15, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute right-1/4 bottom-1/3 h-6 w-6 rounded-full bg-[#A9BBC8]/30"
        animate={{
          y: [0, 20, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="relative z-10 container mx-auto max-w-4xl"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div
          className="mb-12 flex flex-col items-center"
          variants={itemVariants}
        >
          <motion.span
            className="mb-2 flex items-center gap-2 font-medium text-[#88734C]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <BookOpen className="h-4 w-4" />
            LEARN HOW TO USE
          </motion.span>
          <h2 className="mb-4 text-center text-4xl font-light md:text-5xl">
            User Guide
          </h2>
          <motion.div
            className="h-1 w-24 bg-[#88734C]"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 1, delay: 0.5 }}
          ></motion.div>
        </motion.div>

        <motion.p
          className="mx-auto mb-16 max-w-2xl text-center text-muted-foreground"
          variants={itemVariants}
        >
          Discover the perfect way to light up your DIYA candle. Watch our guide
          to get the best experience and ensure your candle lasts longer.
        </motion.p>

        <div className="flex items-center justify-center">
          <motion.div
            className="relative w-full max-w-xs"
            variants={itemVariants}
          >
            <motion.div
              className="overflow-hidden rounded-md shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
            >
              <Video
                width="320"
                height="568"
                className="h-full w-full object-cover"
                urlEndpoint="https://ik.imagekit.io/codernandan"
                src="/assets/user-guide.mp4"
                autoPlay
                loop
                playsInline
                poster={buildSrc({
                  urlEndpoint: "https://ik.imagekit.io/codernandan",
                  src: `/assets/user-guide.mp4/ik-thumbnail.jpg`,
                })}
              />
            </motion.div>
            <motion.div
              className="absolute inset-0 z-[-1] -m-3 rounded-md border-4 border-[#A9BBC8]"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            ></motion.div>

            <motion.div
              className="absolute -top-4 -right-8 h-16 w-16 rounded-full bg-[#88734C]/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              style={{ y: y1 }}
            ></motion.div>
            <motion.div
              className="absolute -bottom-6 -left-10 h-20 w-20 rounded-full bg-[#A9BBC8]/15"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
              style={{ y: y2 }}
            ></motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
