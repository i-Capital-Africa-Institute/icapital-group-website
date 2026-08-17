"use client";

import Image from "next/image";
import Tag from "@/ui/Tag";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const staticImages = [
  "/images/opengraph-image.png",
  "/images/opengraph-image.png",
  "/images/opengraph-image.png",
];

interface JourneyProps {
  journeyData: any;
}

const Journey = ({ journeyData }: JourneyProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Progress from when section center enters viewport to when it leaves
      const start = viewH * 0.5;
      const end = rect.height - viewH * 0.5;
      const traveled = start - rect.top;
      const next = end > 0 ? Math.min(1, Math.max(0, traveled / end)) : 0;
      setProgress(next);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!journeyData?.home?.journeySection) return null;

  const journey = journeyData.home.journeySection;
  const milestones = journey.milestones || [];

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-white px-6 py-24 lg:py-40"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[10%] h-[400px] w-[400px] rounded-full bg-orange-50/50 blur-3xl md:h-[600px] md:w-[600px]" />
        <div className="absolute bottom-[10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-blue-50/50 blur-3xl md:h-[600px] md:w-[600px]" />
      </div>

      <div className="mb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Tag
            title={journey.tagTitle}
            titleColor="text-[#F78019]"
            bgColor="bg-[#F7801915]"
          />
          <h2 className="mt-8 max-w-4xl text-5xl font-black tracking-tight text-[#061C3D] md:text-7xl">
            {journey.heading}
          </h2>
        </motion.div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="absolute left-6 top-0 h-full w-[2px] bg-slate-100 md:left-1/2 md:-translate-x-1/2" />

        {/* CSS transform only — no framer spring on scroll */}
        <div
          className="absolute left-6 top-0 z-10 w-[3px] origin-top bg-gradient-to-b from-orange-400 via-orange-600 to-orange-400 md:left-1/2 md:-translate-x-1/2"
          style={{
            height: "100%",
            transform: `scaleY(${progress})`,
            willChange: "transform",
          }}
        />

        <div className="flex flex-col gap-32 md:gap-56">
          {milestones.map((milestone: any, index: number) => {
            const isEven = index % 2 === 0;
            const displayImage = staticImages[index % staticImages.length];

            return (
              <div
                key={index}
                className="relative flex flex-col items-center md:flex-row"
              >
                <div className="absolute left-6 z-20 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-[#061C3D] shadow-xl md:left-1/2 md:h-8 md:w-8">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                </div>

                <div
                  className={`flex w-full flex-col md:flex-row md:items-center ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full pl-16 md:w-1/2 md:px-12 lg:px-20"
                  >
                    <div className="group relative aspect-[4/3] overflow-hidden rounded-[3rem] shadow-2xl ring-1 ring-black/5">
                      <Image
                        src={displayImage}
                        alt={`Journey ${milestone.year}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#061C3D]/60 via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-8 left-8 text-6xl font-black text-white/20">
                        0{index + 1}
                      </div>
                    </div>
                  </motion.div>

                  <div className="hidden md:block md:w-0" />

                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mt-10 w-full pl-16 md:mt-0 md:w-1/2 md:px-12 lg:px-20"
                  >
                    <div className="group relative flex h-full flex-col justify-between rounded-[3rem] border border-slate-50 bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] lg:p-14">
                      <div className="absolute left-1/2 top-0 h-1.5 w-0 -translate-x-1/2 rounded-b-full bg-orange-500 transition-all duration-500 group-hover:w-1/2" />
                      <div className="flex-1">
                        <h3 className="mt-6 text-3xl font-black leading-tight text-[#061C3D] lg:text-4xl">
                          {milestone.year.includes(":")
                            ? milestone.year
                            : "Strategic Milestone"}
                        </h3>
                        <p className="mt-6 text-justify text-lg leading-relaxed text-slate-500 lg:text-xl">
                          {milestone.text.includes(":")
                            ? milestone.text.split(":")[1]
                            : milestone.text}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Journey;
