"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import Header from "./Header";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import Link from "next/link";
import { motion, HTMLMotionProps } from "framer-motion";
import { getStrapiImageUrl } from "@/utils/getStrapiImageUrl";

const MotionDiv = motion.div as React.ComponentType<
  React.ComponentPropsWithoutRef<"div"> & HTMLMotionProps<"div">
>;
const MotionA = motion.a as React.ComponentType<
  React.ComponentPropsWithoutRef<"a"> & HTMLMotionProps<"a">
>;
const MotionButton = motion.button as React.ComponentType<
  React.ComponentPropsWithoutRef<"button"> & HTMLMotionProps<"button">
>;

// Define the props interface for Hero component
interface HeroProps {
  heroData: any;
}

const Hero = ({ heroData }: HeroProps) => {
  const [active, setActive] = useState(0);

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.4, ease: "easeOut" },
    }),
  };

  const descriptionVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2, ease: "easeOut" } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.35, ease: "easeOut" } },
  };

  // Helper to extract plain text from Strapi rich text blocks
  const getDescriptionText = (description: any) => {
    if (Array.isArray(description)) {
      return description
        .map((block: any) =>
          block.children?.map((child: any) => child.text).join(" "),
        )
        .join("\n");
    }
    return "";
  };

  // Handle case where heroData is not available
  if (!heroData?.home?.hero_slides) {
    return (
      <div className="relative h-screen w-full overflow-hidden rounded-br-[70px] md:rounded-br-[100px]">
        <Header />
        <div className="flex h-full items-center justify-center">
          <p className="text-red-500">Hero content not available</p>
        </div>
      </div>
    );
  }

  const slides = heroData.home.hero_slides;

  return (
    <div className="relative h-screen w-full overflow-hidden rounded-br-[70px] md:rounded-br-[100px]">
      {/* Fixed Header */}
      <Header />

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        autoplay={{ delay: 10000 }}
        loop={slides.length > 1}
        onSlideChange={(swiper) => setActive(swiper.realIndex)}
        className="h-full w-full"
      >
        {slides.map((slide: any, index: number) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full overflow-hidden">
              {/* Background Image — LCP optimization */}
              <Image
                src={getStrapiImageUrl(slide.backgroundImage.url)}
                alt={slide.title}
                fill
                priority={index === 0}
                quality={index === 0 ? 85 : 75}
                sizes="100vw"
                style={{ objectFit: "cover" }}
                className="absolute inset-0 z-0 scale-110"
              />

              {/* Sophisticated Overlay */}
              <div
                className="absolute inset-0 z-10 bg-gradient-to-r from-[#061C3D]/80 via-[#061C3D]/40 to-transparent"
              />
              <div
                className="absolute inset-0 z-10 bg-gradient-to-t from-[#061C3D]/60 via-transparent to-[#061C3D]/20"
              />
              <div
                className="absolute inset-0 z-10 bg-black/10"
              />

              {/* Hero Content */}
              <div className="absolute inset-0 z-20 flex flex-col items-start justify-center px-8 text-white md:px-16 lg:px-32">
                {/* Content Wrapper */}
                <div className="w-full max-w-4xl space-y-6 md:space-y-8">
                  {/* Event Badge */}
                  {/* {slide.bagde && (
                    <MotionSpan
                      variants={badgeVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.3 }}
                      className="inline-block rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 text-sm font-bold tracking-widest uppercase text-orange-400"
                    >
                      {slide.bagde}
                    </MotionSpan>
                  )} */}

                  {/* Title */}
                  <motion.h1
                    variants={titleVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-5xl font-extrabold leading-[1.1] tracking-tighter sm:text-7xl lg:text-8xl lg:leading-[1.05]"
                  >
                    {slide.title.split(" ").map((word: string, i: number) => (
                      <motion.span
                        key={i}
                        custom={i}
                        variants={wordVariants}
                        className={twMerge(
                          "mr-3 inline-block",
                          word.toLowerCase().includes("icapital") && "text-orange-500"
                        )}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.h1>

                  {/* Description */}
                  <motion.p
                    variants={descriptionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="max-w-2xl text-xl leading-relaxed text-blue-50/80 lg:text-2xl font-medium"
                  >
                    {getDescriptionText(slide.description)}
                  </motion.p>

                  {/* Buttons */}
                  <MotionDiv
                    variants={buttonVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex flex-col items-start gap-4 pt-4 md:flex-row md:items-center"
                  >
                    {slide.buttonText && (
                      <MotionA
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        href={slide.buttonLink}
                        className="group flex items-center gap-3 rounded-full bg-orange-500 px-10 py-5 text-lg font-black text-white shadow-[0_20px_40px_-10px_rgba(249,115,22,0.5)] transition-all hover:bg-orange-600"
                      >
                        {slide.buttonText}
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                      </MotionA>
                    )}
                    <Link href="/news">
                      <MotionButton
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                        whileTap={{ scale: 0.98 }}
                        className="rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-10 py-4 text-lg font-bold text-white transition-all hover:bg-white hover:text-[#061C3D]"
                      >
                        Latest News
                      </MotionButton>
                    </Link>
                  </MotionDiv>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Fixed Navigation Indicators */}
      <div className="absolute bottom-12 left-8 md:left-16 lg:left-32 z-50 flex items-center gap-4">
        {slides.map((_: any, index: number) => (
          <Dot key={index} active={index === active} onClick={() => {}} />
        ))}
      </div>
    </div>
  );
};

export default Hero;

// Dot Component
const Dot = ({ active, onClick }: { active: boolean; onClick: () => void }) => {
  return (
    <motion.button
      onClick={onClick}
      animate={{
        width: active ? 48 : 12,
        backgroundColor: active ? "#F97316" : "rgba(255, 255, 255, 0.3)",
      }}
      className="h-2 rounded-full transition-all duration-300 pointer-events-auto"
      aria-label="Go to slide"
    />
  );
};
