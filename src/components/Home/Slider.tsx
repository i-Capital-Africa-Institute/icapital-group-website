"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { getStrapiImageUrl } from "@/utils/getStrapiImageUrl";

interface Logo {
  logo: Array<{
    url: string;
  }>;
  altText?: string;
}

interface SliderProps {
  sliderData: any;
}

const Slider: React.FC<SliderProps> = ({ sliderData }) => {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef);

  // 1. Data Validation
  const data = sliderData?.home?.trustedCompaniesSlider;
  const sectionTitle = data?.sectionTitle || "Trusted by Top Companies";
  const logos = data?.logos || [];

  if (logos.length === 0) return null;

  // 2. Seamless Loop logic
  // We triple the logos to ensure that even on ultra-wide screens, there is no empty space
  const duplicatedLogos = [...logos, ...logos, ...logos];

  // 3. Dynamic Speed calculation
  // Adjust duration based on number of logos (more logos = more time to keep speed consistent)
  const duration = logos.length * 3; 

  const getImageUrl = (url: string): string => getStrapiImageUrl(url);

  return (
    <section 
      ref={containerRef}
      className="relative overflow-hidden bg-white py-16 md:py-24"
    >
      {/* Decorative Background Elements */}
      <div className="absolute -left-20 top-0 h-64 w-64 rounded-full bg-blue-500/5 blur-[100px]" />
      <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-orange-500/5 blur-[100px]" />

      <div className="container relative z-10 mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center text-3xl font-extrabold tracking-tight text-[#061C3D] md:text-5xl"
        >
          {sectionTitle}
        </motion.h2>

        <div 
          className="relative mt-10"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Enhanced Edge Fades */}
          <div className="absolute left-0 top-0 z-20 h-full w-20 bg-gradient-to-r from-white via-white/80 to-transparent md:w-40" />
          <div className="absolute right-0 top-0 z-20 h-full w-20 bg-gradient-to-l from-white via-white/80 to-transparent md:w-40" />

          <div className="flex overflow-hidden">
            <motion.div
              className="flex items-center gap-12 md:gap-20"
              animate={isPaused ? {} : { x: ["0%", "-33.33%"] }}
              transition={{
                ease: "linear",
                duration: duration,
                repeat: Infinity,
              }}
            >
              {duplicatedLogos.map((item, index) => (
                <motion.div
                  key={`${item.logo?.[0]?.url}-${index}`}
                  className="group relative flex h-20 w-32 flex-shrink-0 items-center justify-center md:h-28 md:w-48"
                >
                  {/* Logo Hover Card effect */}
                  <div className="absolute inset-0 scale-90 rounded-2xl bg-slate-50 opacity-0 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100" />
                  
                  {item.logo?.[0]?.url && (
                    <div className="relative h-12 w-28 transition-all duration-300 group-hover:scale-105 md:h-16 md:w-40">
                      <Image
                        src={getStrapiImageUrl(item.logo[0].url)}
                        alt={item.altText || "Company Logo"}
                        fill
                        sizes="(max-width: 768px) 120px, 200px"
                        className="object-contain"
                        priority={index === 0}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Slider;