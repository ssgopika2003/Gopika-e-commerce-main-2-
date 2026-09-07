"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import * as React from "react";

import { TESTIMONIALS } from "@/data/testimonials";
import { cn } from "@/lib/utils";

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [direction, setDirection] = React.useState(1);

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    );
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const handleImageClick = (index: number) => {
    if (index === currentIndex) return;
    const diff = index - currentIndex;
    if (diff > 0 || diff < -TESTIMONIALS.length / 2) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setCurrentIndex(index);
  };

  const getVisibleItems = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index =
        (currentIndex + i + TESTIMONIALS.length) % TESTIMONIALS.length;
      visible.push({ index, position: i });
    }
    return visible;
  };

  const getImageProps = (position: number) => {
    const absPos = Math.abs(position);

    if (position === 0) {
      return {
        scale: 1,
        opacity: 1,
        zIndex: 50,
        blur: 0,
      };
    } else if (absPos === 1) {
      return {
        scale: 0.7,
        opacity: 0.75,
        zIndex: 40,
        blur: 0,
      };
    } else {
      return {
        scale: 0.55,
        opacity: 0.5,
        zIndex: 30,
        blur: 1,
      };
    }
  };

  return (
    <section className="w-full overflow-hidden py-4 md:py-6">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-center text-[28px] font-light tracking-wide text-foreground md:mb-12 md:text-[36px]">
          Testimonials
        </h2>

        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.button
            onClick={handlePrevious}
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute top-[70px] left-1 z-[60] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-card/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-card hover:shadow-xl active:scale-95 md:top-[100px] md:left-4 md:h-11 md:w-11 lg:left-8"
            style={{ pointerEvents: isHovered ? "auto" : "none" }}
            aria-label="Previous testimonial"
          >
            <ChevronLeft
              className="h-4 w-4 text-foreground md:h-5 md:w-5"
              strokeWidth={2.5}
            />
          </motion.button>

          <motion.button
            onClick={handleNext}
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="absolute top-[70px] right-1 z-[60] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-card/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-card hover:shadow-xl active:scale-95 md:top-[100px] md:right-4 md:h-11 md:w-11 lg:right-8"
            style={{ pointerEvents: isHovered ? "auto" : "none" }}
            aria-label="Next testimonial"
          >
            <ChevronRight
              className="h-4 w-4 text-foreground md:h-5 md:w-5"
              strokeWidth={2.5}
            />
          </motion.button>

          <div className="relative mb-10 flex h-[120px] items-center justify-center overflow-visible md:mb-16 md:h-[180px]">
            <div className="relative flex items-center justify-center gap-2 md:gap-4">
              <AnimatePresence initial={false} custom={direction}>
                {getVisibleItems().map(({ index, position }) => {
                  const { scale, opacity, zIndex, blur } =
                    getImageProps(position);
                  const isActive = position === 0;
                  const testimonial = TESTIMONIALS[index];

                  const getSlideX = (pos: number) => pos * 155;

                  return (
                    <motion.button
                      key={`${testimonial.id}-${index}`}
                      onClick={() => handleImageClick(index)}
                      custom={direction}
                      initial={{
                        x: direction > 0 ? 500 : -500,
                        scale: 0.4,
                        opacity: 0,
                      }}
                      animate={{
                        x: getSlideX(position),
                        scale: scale,
                        opacity: opacity,
                        filter: blur > 0 ? `blur(${blur}px)` : "blur(0px)",
                      }}
                      exit={{
                        x: direction > 0 ? -500 : 500,
                        scale: 0.4,
                        opacity: 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 28,
                        mass: 0.8,
                      }}
                      className={cn(
                        "absolute cursor-pointer overflow-hidden focus:outline-none",
                        "h-[90px] w-[90px] md:h-[120px] md:w-[120px]",
                        "rounded-[32px] md:rounded-[44px]",
                        isActive &&
                          "shadow-xl ring-2 ring-blue-100/70 ring-offset-2 md:shadow-2xl md:ring-4 md:ring-offset-4"
                      )}
                      style={{
                        zIndex: zIndex,
                      }}
                      whileHover={{ opacity: 1.05 }}
                    >
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 110px, 160px"
                        priority={isActive}
                      />
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center px-4 md:mt-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                initial={{
                  opacity: 0,
                  x: direction > 0 ? 100 : -100,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: direction > 0 ? -100 : 100,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                className="flex w-full flex-col items-center"
              >
                <div className="mb-5 flex gap-1 md:mb-7">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: i * 0.05,
                        duration: 0.3,
                        ease: "backOut",
                      }}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4 md:h-5 md:w-5",
                          i < TESTIMONIALS[currentIndex].rating
                            ? "fill-[#FFB800] text-[#FFB800]"
                            : "fill-muted text-muted"
                        )}
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="flex min-h-[100px] items-center justify-center overflow-hidden md:min-h-[130px]">
                  <p className="mb-6 max-w-2xl px-2 text-center text-[15px] leading-relaxed font-normal text-muted-foreground md:mb-8 md:px-8 md:text-[17px] lg:text-[19px]">
                    {TESTIMONIALS[currentIndex].text}
                  </p>
                </div>

                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 48, opacity: 1 }}
                  transition={{
                    delay: 0.2,
                    duration: 0.5,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                  className="mb-4 h-[1px] bg-border md:mb-5"
                />

                <cite className="text-[10px] font-medium tracking-[0.2em] text-foreground uppercase not-italic md:text-[11px] md:tracking-[0.25em]">
                  -- {TESTIMONIALS[currentIndex].name}
                </cite>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
