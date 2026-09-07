"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ActionProps {
  text: string;
  href: string;
  variant?: ButtonProps["variant"];
  className?: string;
}

interface HeroSectionProps {
  title: React.ReactNode;
  subtitle: string;
  actions: ActionProps[];
  images: string[];
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const CTASection = ({
  title,
  subtitle,
  actions,
  images,
  className,
}: HeroSectionProps) => {
  return (
    <section
      className={cn(
        "w-full overflow-hidden bg-background py-6 sm:py-12",
        className
      )}
    >
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-8">
        {/* Left Column: Text Content */}
        <motion.div
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
            variants={itemVariants}
          >
            {title}
          </motion.h1>
          <motion.p
            className="mt-6 max-w-md text-lg text-muted-foreground"
            variants={itemVariants}
          >
            {subtitle}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start"
            variants={itemVariants}
          >
            {actions.map((action, index) => {
              const isAnchor =
                action.href.startsWith("/#") || action.href.startsWith("#");

              const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                if (isAnchor) {
                  e.preventDefault();
                  const targetId = action.href.split("#")[1];
                  const element = document.getElementById(targetId);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }
              };

              return (
                <Button
                  key={index}
                  asChild
                  variant={action.variant}
                  size="lg"
                  className={action.className}
                >
                  <Link
                    href={action.href}
                    onClick={isAnchor ? handleClick : undefined}
                  >
                    {action.text}
                  </Link>
                </Button>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Right Column: Image Collage */}
        <motion.div
          className="relative h-[400px] w-full sm:h-[500px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Decorative Shapes */}
          <motion.div
            className="absolute -top-4 left-1/4 h-16 w-16 rounded-full bg-blue-200/50 dark:bg-blue-800/30"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div
            className="absolute right-1/4 bottom-0 h-12 w-12 rounded-lg bg-purple-200/50 dark:bg-purple-800/30"
            variants={floatingVariants}
            animate="animate"
            style={{ transitionDelay: "0.5s" }}
          />
          <motion.div
            className="absolute bottom-1/4 left-4 h-6 w-6 rounded-full bg-green-200/50 dark:bg-green-800/30"
            variants={floatingVariants}
            animate="animate"
            style={{ transitionDelay: "1s" }}
          />

          {/* Images */}
          <motion.div
            className="absolute top-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-2xl bg-muted p-2 shadow-lg sm:h-64 sm:w-64"
            style={{ transformOrigin: "bottom center" }}
            variants={imageVariants}
          >
            <img
              src={images[0]}
              alt="Student learning"
              className="h-full w-full rounded-xl object-cover"
            />
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-0 h-40 w-40 rounded-2xl bg-muted p-2 shadow-lg sm:h-56 sm:w-56"
            style={{ transformOrigin: "left center" }}
            variants={imageVariants}
          >
            <img
              src={images[1]}
              alt="Tutor assisting"
              className="h-full w-full rounded-xl object-cover"
            />
          </motion.div>
          <motion.div
            className="absolute bottom-0 left-0 h-32 w-32 rounded-2xl bg-muted p-2 shadow-lg sm:h-48 sm:w-48"
            style={{ transformOrigin: "top right" }}
            variants={imageVariants}
          >
            <img
              src={images[2]}
              alt="Collaborative discussion"
              className="h-full w-full rounded-xl object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
