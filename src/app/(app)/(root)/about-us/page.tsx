"use client";

import { buildSrc, Video } from "@imagekit/next";
import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Award,
  Brain,
  Building2,
  Calendar,
  CheckCircle,
  FlaskConicalIcon,
  Hand,
  LeafIcon,
  Music2Icon,
  Sparkles,
  Star,
  TrendingDown,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function AboutUsSPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });
  const isStatsInView = useInView(statsRef, { once: false, amount: 0.3 });

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

  const services = [
    {
      icon: <FlaskConicalIcon className="h-6 w-6" />,
      secondaryIcon: (
        <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-[#A9BBC8]" />
      ),
      title: "Chemistry",
      description:
        "We approach candles like a lab experiment. The ratio of wax to fragrance oil is calculated precisely to ensure the scent fills your room without giving you a headache.",
      position: "left",
    },
    {
      icon: <Music2Icon className="h-6 w-6" />,
      secondaryIcon: (
        <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-[#A9BBC8]" />
      ),
      title: "The Sound",
      description:
        "Our signature Crackling Wooden Wick isn't just for looks. When lit, it creates a soft crackling sound, mimicking a tiny fireplace or the sound of rain.",
      position: "left",
    },
    {
      icon: <Hand className="h-6 w-6" />,
      secondaryIcon: (
        <Star className="absolute -top-1 -right-1 h-4 w-4 text-[#A9BBC8]" />
      ),
      title: "Small Batch",
      description:
        "Mass production feels empty. We make candles in small batches of 10-15 at a time, ensuring quality control that big brands can't match.",
      position: "left",
    },
    {
      icon: <LeafIcon className="h-6 w-6" />,
      secondaryIcon: (
        <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-[#A9BBC8]" />
      ),
      title: "Pure Soy Wax",
      description:
        "Most market candles use Paraffin (a byproduct of petrol). We use 100% Natural Soy Wax. It burns cleaner, longer, and is better for the planet.",
      position: "right",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      secondaryIcon: (
        <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-[#A9BBC8]" />
      ),
      title: "Nostalgia First",
      description:
        "We don't do generic Vanilla. We capture moments—the smell of wet mud (Petrichor), winter mornings (Parijaat), and hill stations (Waadi).",
      position: "right",
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      secondaryIcon: (
        <Star className="absolute -top-1 -right-1 h-4 w-4 text-[#A9BBC8]" />
      ),
      title: "Student Run",
      description:
        "When you buy a DIYA candle, you aren't funding a CEO's third home. You are funding our tuition, our experiments, and our dream.",
      position: "right",
    },
  ];

  const stats = [
    { icon: <Award />, value: 50, label: "Prototypes Tested", suffix: "+" },
    { icon: <Users />, value: 100, label: "Hand Poured", suffix: "%" },
    { icon: <Calendar />, value: 8, label: "Engineers", suffix: "" },
    {
      icon: <TrendingDown />,
      value: 0,
      label: "Toxins Rate",
      suffix: "%",
    },
  ];

  return (
    <section
      id="about-section"
      ref={sectionRef}
      className="relative w-full overflow-hidden px-4 py-8 text-foreground"
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
        className="relative z-10 container mx-auto max-w-6xl"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <motion.div
          className="mb-6 flex flex-col items-center"
          variants={itemVariants}
        >
          <motion.span
            className="mb-2 flex items-center gap-2 font-medium text-[#88734C]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Zap className="h-4 w-4" />
            DISCOVER OUR STORY
          </motion.span>
          <h2 className="mb-4 text-center text-4xl font-light md:text-5xl">
            About Us
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
          We are a team of engineering students who realized that in the race of
          deadlines, we forgot how to pause. DIYA is our small attempt to
          engineer “Sukoon” (peace) into everyday life. Led by{" "}
          <b className="font-bold">Manjesh Bhaskar</b>, we blend creativity,
          simplicity, and thoughtful design to build experiences that help you
          slow down, breathe, and feel at home.
        </motion.p>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-16">
            {services
              .filter((service) => service.position === "left")
              .map((service, index) => (
                <ServiceItem
                  key={`left-${index}`}
                  icon={service.icon}
                  secondaryIcon={service.secondaryIcon}
                  title={service.title}
                  description={service.description}
                  variants={itemVariants}
                  delay={index * 0.2}
                  direction="left"
                />
              ))}
          </div>

          <div className="order-first mb-8 flex items-center justify-center md:order-0 md:mb-0">
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
                  src="/testimonial/about-us.mp4"
                  preload="auto"
                  autoPlay
                  loop
                  playsInline
                  poster={buildSrc({
                    urlEndpoint: "https://ik.imagekit.io/codernandan",
                    src: `/testimonial/about-us.mp4/ik-thumbnail.jpg`,
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

              <motion.div
                className="absolute -top-10 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#88734C]"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              ></motion.div>
              <motion.div
                className="absolute -bottom-12 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#A9BBC8]"
                animate={{
                  y: [0, 10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              ></motion.div>
            </motion.div>
          </div>

          <div className="space-y-16">
            {services
              .filter((service) => service.position === "right")
              .map((service, index) => (
                <ServiceItem
                  key={`right-${index}`}
                  icon={service.icon}
                  secondaryIcon={service.secondaryIcon}
                  title={service.title}
                  description={service.description}
                  variants={itemVariants}
                  delay={index * 0.2}
                  direction="right"
                />
              ))}
          </div>
        </div>

        <motion.div
          ref={statsRef}
          className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <StatCounter
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              delay={index * 0.1}
            />
          ))}
        </motion.div>

        <motion.div
          className="mt-20 flex flex-col items-center justify-between gap-6 rounded-xl bg-card p-8 text-card-foreground shadow-lg md:flex-row"
          initial={{ opacity: 0, y: 30 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="flex-1">
            <h3 className="mb-2 text-2xl font-medium">
              Ready to transform your space?
            </h3>
            <p className="text-muted-foreground">
              Let&apos;s create something beautiful together.
            </p>
          </div>
          <Link href="/">
            <motion.button
              className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#88734C] px-6 py-3 font-medium text-white transition-colors hover:bg-[#88734C]/90"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

interface ServiceItemProps {
  icon: React.ReactNode;
  secondaryIcon?: React.ReactNode;
  title: string;
  description: string;
  variants: Variants;
  delay: number;
  direction: "left" | "right";
}

function ServiceItem({
  icon,
  secondaryIcon,
  title,
  description,
  variants,
  delay,
  direction,
}: ServiceItemProps) {
  return (
    <motion.div
      className="group flex flex-col"
      variants={variants}
      transition={{ delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="mb-3 flex items-center gap-3"
        initial={{ x: direction === "left" ? -20 : 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
      >
        <motion.div
          className="relative rounded-lg bg-[#88734C]/10 p-3 text-[#88734C] transition-colors duration-300 group-hover:bg-[#88734C]/20"
          whileHover={{
            rotate: [0, -10, 10, -5, 0],
            transition: { duration: 0.5 },
          }}
        >
          {icon}
          {secondaryIcon}
        </motion.div>
        <h3 className="text-xl font-medium text-foreground transition-colors duration-300 group-hover:text-[#88734C]">
          {title}
        </h3>
      </motion.div>
      <motion.p
        className="pl-12 text-sm leading-relaxed text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.4 }}
      >
        {description}
      </motion.p>
      <motion.div
        className="mt-3 flex items-center pl-12 text-xs font-medium text-[#88734C] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
      >
        <span className="flex items-center gap-1">
          Learn more <ArrowRight className="h-3 w-3" />
        </span>
      </motion.div>
    </motion.div>
  );
}

interface StatCounterProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix: string;
  delay: number;
}

function StatCounter({ icon, value, label, suffix, delay }: StatCounterProps) {
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: false });

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 10,
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    } else {
      springValue.set(0);
    }
  }, [isInView, value, springValue]);

  const displayValue = useTransform(springValue, (latest) =>
    Math.floor(latest)
  );

  return (
    <motion.div
      className="group flex flex-col items-center rounded-xl bg-card/50 p-6 text-center backdrop-blur-sm transition-colors duration-300 hover:bg-card"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay },
        },
      }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/5 text-[#88734C] transition-colors duration-300 group-hover:bg-[#88734C]/10"
        whileHover={{ rotate: 360, transition: { duration: 0.8 } }}
      >
        {icon}
      </motion.div>
      <motion.div
        ref={countRef}
        className="flex items-center text-3xl font-bold text-foreground"
      >
        <motion.span>{displayValue}</motion.span>
        <span>{suffix}</span>
      </motion.div>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      <motion.div className="mt-3 h-0.5 w-10 bg-[#88734C] transition-all duration-300 group-hover:w-16" />
    </motion.div>
  );
}
