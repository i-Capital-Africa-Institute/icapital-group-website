"use client";

import Image from "next/image";
import Header from "./Header";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { getStrapiImageUrl } from "@/utils/getStrapiImageUrl";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaTag,
} from "react-icons/fa";

export interface Article {
  documentId?: string;
  title: string;
  slug: string;
  summary?: string;
  content?: any;
  featuredImage?: {
    url: string;
    width?: number;
    height?: number;
  };
  publicationDate?: string;
  isFeatured?: boolean;
  category?: {
    name: string;
    slug?: string;
  };
  author?: {
    name: string;
    avatar?: {
      url: string;
    };
  };
}

interface HeroProps {
  heroData?: any;
  newsData?: Article[];
  upcomingEventsData?: any;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const getImageUrl = (url?: string) => {
  if (!url) return "/fallback-image.png";
  return getStrapiImageUrl(url);
};

const getDescriptionText = (description: any) => {
  if (typeof description === "string") return description;
  if (Array.isArray(description)) {
    return description
      .map((block: any) =>
        block.children?.map((child: any) => child.text).join(" "),
      )
      .join("\n");
  }
  return "";
};

const Hero = ({ heroData, newsData = [], upcomingEventsData }: HeroProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const hasNews = Array.isArray(newsData) && newsData.length > 0;
  const heroSlides = heroData?.home?.hero_slides || [];

  const items = hasNews ? newsData : heroSlides;

  if (!items || items.length === 0) {
    return (
      <div className="relative h-screen w-full overflow-hidden rounded-br-[70px] md:rounded-br-[100px] bg-[#061C3D]">
        <Header />
        <div className="flex h-full items-center justify-center">
          <p className="text-white/70">Content not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden rounded-br-[70px] md:rounded-br-[100px] bg-[#061C3D]">
      {/* Fixed Header */}
      <Header />

      {/* Swiper Carousel */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={items.length > 1}
        className="h-full w-full"
      >
        {items.map((item: any, index: number) => {
          const title = item.title || "News & Updates";
          const summary = hasNews
            ? item.summary
            : getDescriptionText(item.description);
          const imageUrl = hasNews
            ? item.featuredImage?.url
            : item.backgroundImage?.url;
          const categoryName = item.category?.name || "News & Updates";
          const dateStr = item.publicationDate;
          const slug = item.slug;
          const buttonText = item.buttonText || "Explore Our Services";
          const buttonLink = item.buttonLink || "#about";

          return (
            <SwiperSlide key={slug || index} className="relative h-full w-full">
              {/* Background Image */}
              {imageUrl && (
                <Image
                  src={getImageUrl(imageUrl)}
                  alt={title}
                  fill
                  priority={index === 0}
                  quality={90}
                  sizes="100vw"
                  style={{ objectFit: "cover" }}
                  className="absolute inset-0 z-0 scale-105 transition-transform duration-1000 ease-out"
                />
              )}

              {/* Gradient Overlays */}
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#061C3D]/95 via-[#061C3D]/75 to-[#061C3D]/40" />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#061C3D]/90 via-transparent to-[#061C3D]/40" />
              <div className="absolute inset-0 z-10 bg-black/20" />

              {/* Slide Content */}
              <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 text-white md:px-16 lg:px-32 pt-20 sm:pt-24">
                <div className="w-full max-w-4xl space-y-6 md:space-y-8">
                  {/* Category & Date Tags */}
                  {hasNews && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-wrap items-center gap-3"
                    >
                      <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/40 bg-orange-500/80 px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-white backdrop-blur-md shadow-lg">
                        <FaTag className="text-[10px]" />
                        {categoryName}
                      </span>
                      {dateStr && (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-md">
                          <FaCalendarAlt className="text-[10px] text-orange-400" />
                          {formatDate(dateStr)}
                        </span>
                      )}
                    </motion.div>
                  )}

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-7xl text-white drop-shadow-md"
                  >
                    {title}
                  </motion.h1>

                  {/* Summary */}
                  {summary && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="max-w-3xl text-lg leading-relaxed text-blue-50/90 sm:text-xl lg:text-2xl font-medium line-clamp-3 drop-shadow-sm"
                    >
                      {summary}
                    </motion.p>
                  )}

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-wrap items-center gap-4 pt-2"
                  >
                    {hasNews ? (
                      <>
                        <Link
                          href={`/news/${slug}`}
                          className="group flex items-center gap-3 rounded-full bg-orange-500 px-9 py-4 text-base sm:text-lg font-black text-white shadow-[0_20px_40px_-10px_rgba(249,115,22,0.5)] transition-all hover:bg-orange-600 hover:scale-105 active:scale-95"
                        >
                          <span>Read Full Story</span>
                          <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link href="/news">
                          <button
                            type="button"
                            className="rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-9 py-4 text-base sm:text-lg font-bold text-white transition-all hover:bg-white hover:text-[#061C3D] hover:scale-105 active:scale-95"
                          >
                            View All News
                          </button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <a
                          href={buttonLink}
                          className="group flex items-center gap-3 rounded-full bg-orange-500 px-10 py-5 text-lg font-black text-white shadow-[0_20px_40px_-10px_rgba(249,115,22,0.5)] transition-all hover:bg-orange-600 hover:scale-105 active:scale-95"
                        >
                          {buttonText}
                          <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                        </a>
                        <Link href="/news">
                          <button
                            type="button"
                            className="rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-10 py-4 text-lg font-bold text-white transition-all hover:bg-white hover:text-[#061C3D] hover:scale-105 active:scale-95"
                          >
                            Latest News
                          </button>
                        </Link>
                      </>
                    )}
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Navigation Controls overlay */}
      {items.length > 1 && (
        <>
          {/* Pagination Indicators (Dots) */}
          <div className="absolute bottom-8 left-8 sm:left-16 lg:left-32 z-30 flex items-center gap-2">
            {items.map((_: any, idx: number) => (
              <button
                key={idx}
                type="button"
                onClick={() => swiperRef.current?.slideTo(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "w-10 bg-orange-500"
                    : "w-3 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows + Slide Counter */}
          <div className="absolute bottom-8 right-8 sm:right-16 lg:right-32 z-30 flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm font-bold text-white/80 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
              <span className="text-orange-400 font-extrabold">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span>/</span>
              <span>{String(items.length).padStart(2, "0")}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition-all hover:bg-orange-500 hover:border-orange-500 active:scale-95 shadow-xl"
                aria-label="Previous slide"
              >
                <FaChevronLeft className="text-sm" />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition-all hover:bg-orange-500 hover:border-orange-500 active:scale-95 shadow-xl"
                aria-label="Next slide"
              >
                <FaChevronRight className="text-sm" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Hero;

