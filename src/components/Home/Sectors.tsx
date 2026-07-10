"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Tag from "@/ui/Tag";
import { getStrapiImageUrl } from "@/utils/getStrapiImageUrl";

// Define types for our data
interface ImageData {
  url: string;
  width: number;
  height: number;
}

interface Card {
  title: string;
  description: string;
  link: string;
  originalWebsiteBgColor: string;
  isGradient: boolean;
  image: ImageData;
  logo: ImageData;
}

interface SectorsData {
  tagTitle: string;
  heading: string;
  description: string;
  cards: Card[];
}

// Define the props interface for Sectors component
interface SectorsProps {
  sectorsData: SectorsData | null;
}

const Sectors = ({ sectorsData }: SectorsProps) => {
  const pathname = usePathname();

  // Helper function to determine if a color is dark based on its hex value
  const isColorDark = (hexColor: string): boolean => {
    if (hexColor?.includes("gradient")) {
      return true;
    }
    const hex = hexColor?.replace("#", "");
    const r = parseInt(hex?.substring(0, 2), 16);
    const g = parseInt(hex?.substring(2, 4), 16);
    const b = parseInt(hex?.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  };

  const getElementColor = (card: Card): string => {
    if (card.isGradient) {
      if (card.originalWebsiteBgColor.includes("#F78019")) {
        return "#F78019";
      }
      return "#19A2F7";
    }
    return card.originalWebsiteBgColor;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 32,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  // Handle case where sectorsData is not available
  if (!sectorsData?.home?.SectorsSection) {
    return (
      <section className="bg-slate-50 px-4 py-16 sm:px-6 md:px-12">
        <div className="text-center text-red-500">
          Sectors data not available
        </div>
      </section>
    );
  }

  const sectorsSection = sectorsData.home.SectorsSection;

  return (
    <section
      key={pathname}
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50 px-4 py-16 sm:px-6 md:px-8 lg:px-12 md:py-20 lg:py-28"
    >
      {/* Decorative Background Blobs — static, no pulse (avoids scroll paint thrashing) */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-400/10 blur-3xl md:h-96 md:w-96" />
      <div className="pointer-events-none absolute -right-32 top-1/2 h-72 w-72 rounded-full bg-orange-400/10 blur-3xl md:h-96 md:w-96" />

      <div className="container relative z-10 mx-auto max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center sm:mb-16 md:mb-20"
        >
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <Tag
              title={sectorsSection.tagTitle}
              titleColor="text-orange-500"
              bgColor="bg-orange-500/10"
            />
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-4 sm:mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 bg-clip-text text-transparent">
              {sectorsSection.heading}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed font-medium max-w-3xl mx-auto px-4"
          >
            {sectorsSection.description}
          </motion.p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {(sectorsSection.cards || []).map((card: Card, index: number) => {
            const cardColor = card.originalWebsiteBgColor || "#0f172a";
            return (
              <motion.div
                key={`sector-card-${index}`}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                onClick={() => {
                  if ([1, 2, 3, 5].includes(index)) {
                    window.open(card.link, "_blank");
                  } else {
                    window.location.href = card.link;
                  }
                }}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                {/* Image Section - No cropping */}
                <div className="relative flex aspect-[16/9] w-full items-center justify-center bg-white overflow-hidden border-b border-slate-100">
                  <div
                    className="absolute inset-x-0 top-0 h-1 opacity-80 z-10"
                    style={{ backgroundColor: cardColor }}
                  />
                  {card.image?.url ? (
                    <Image
                      src={getStrapiImageUrl(card.image.url)}
                      alt={card.title}
                      fill
                      className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300 text-sm">
                      No Image Provided
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="relative flex flex-1 flex-col p-6 sm:p-8">
                  {/* Floating Logo */}
                  <div className="absolute -top-10 right-6 flex h-16 w-16 items-center justify-center rounded-lg bg-white p-2 shadow-md border border-slate-100">
                    {card.logo?.url ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={getStrapiImageUrl(card.logo.url)}
                          alt={`${card.title} Logo`}
                          fill
                          className="object-contain"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-slate-300">
                        {card.title.charAt(0)}
                      </span>
                    )}
                  </div>

                  <h3 className="mb-3 text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors pr-14">
                    {card.title}
                  </h3>

                  <p className="mb-6 flex-1 text-sm font-medium leading-relaxed text-slate-600 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                    {card.description}
                  </p>

                  {/* Footer / CTA */}
                  {/* <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5">
                    <span className="text-sm font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
                      Learn More
                    </span>
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 opacity-80 transition-all duration-300 group-hover:bg-slate-900 group-hover:text-white group-hover:opacity-100"
                      style={{
                        backgroundColor: card.isGradient ? undefined : cardColor,
                      }}
                    >
                      <span className="text-lg font-bold leading-none -translate-y-[1px]">
                        →
                      </span>
                    </div>
                  </div> */}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 sm:mt-20 md:mt-24 text-center"
        >
          {/* <p className="text-sm sm:text-base text-slate-600 font-medium">
            Explore more sectors and discover opportunities that fit your business needs
          </p> */}
        </motion.div>
      </div>
    </section>
  );
};

export default Sectors;