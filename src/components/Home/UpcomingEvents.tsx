"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getStrapiImageUrl } from "@/utils/getStrapiImageUrl";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaTag,
} from "react-icons/fa";

interface Button {
  buttonText: string;
  buttonLink: string;
}

interface Article {
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

interface UpcomingEventsProps {
  upcomingEventsData?: any;
  newsData?: Article[];
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

const UpcomingEvents = ({
  upcomingEventsData,
  newsData = [],
}: UpcomingEventsProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // If we have news articles, use them for the slider
  const hasNews = Array.isArray(newsData) && newsData.length > 0;
  const rawEventData = upcomingEventsData?.home?.upcomingEvents;

  // Fallback single event if no articles exist
  if (!hasNews && !rawEventData) {
    return null;
  }

  const tagTitle = rawEventData?.tagTitle || "News & Updates";
  const sectionTitle = "Latest News & Updates";

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 py-16 md:py-24">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange-400/20 blur-3xl opacity-60" />

      <div className="container relative z-10 mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/20 px-4 py-1.5 backdrop-blur-md"
            >
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-bold tracking-wider text-white uppercase md:text-sm">
                {tagTitle}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-3xl font-extrabold text-white sm:text-4xl md:text-5xl"
            >
              {sectionTitle}
            </motion.h2>
          </div>

          {/* Header Controls: All News button + Slider Nav */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <Link
              href="/news"
              className="flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-6 py-2.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-orange-600 shadow-md"
            >
              <span>View All News</span>
              <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
            </Link>

            {hasNews && newsData.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-orange-600 active:scale-95 shadow-md"
                  aria-label="Previous slide"
                >
                  <FaChevronLeft className="text-sm" />
                </button>
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slideNext()}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-sm transition-all hover:bg-white hover:text-orange-600 active:scale-95 shadow-md"
                  aria-label="Next slide"
                >
                  <FaChevronRight className="text-sm" />
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* News Slider */}
        {hasNews ? (
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              autoplay={{
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={newsData.length > 1}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                1024: {
                  slidesPerView: 1,
                  spaceBetween: 32,
                },
              }}
              className="w-full !pb-12"
            >
              {newsData.map((article, index) => (
                <SwiperSlide key={article.slug || index}>
                  <div className="overflow-hidden rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 lg:p-10 shadow-2xl transition-all duration-300">
                    <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:gap-12">
                      {/* Text Column */}
                      <div className="w-full lg:w-[48%] flex flex-col justify-center order-2 lg:order-1">
                        {/* Meta Tags */}
                        <div className="flex flex-wrap items-center gap-3">
                          {article.category?.name && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-600 shadow-sm">
                              <FaTag className="text-[10px]" />
                              {article.category.name}
                            </span>
                          )}
                          {article.publicationDate && (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90">
                              <FaCalendarAlt className="text-[10px] text-white/80" />
                              {formatDate(article.publicationDate)}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="mt-4 text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-4xl">
                          {article.title}
                        </h3>

                        {/* Summary */}
                        {article.summary && (
                          <p className="mt-4 text-base leading-relaxed text-white/90 md:text-lg line-clamp-3 md:line-clamp-4">
                            {article.summary}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                          <Link
                            href={`/news/${article.slug}`}
                            className="group inline-flex items-center gap-3 rounded-full bg-white px-8 py-3.5 text-sm md:text-base font-bold text-orange-600 shadow-lg transition-all duration-300 hover:bg-orange-50 hover:shadow-xl hover:scale-105 active:scale-95"
                          >
                            <span>Read Full Story</span>
                            <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
                          </Link>
                        </div>
                      </div>

                      {/* Image Column - Increased Size */}
                      <div className="w-full lg:w-[52%] order-1 lg:order-2 flex">
                        <Link
                          href={`/news/${article.slug}`}
                          className="group relative block w-full min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] aspect-[16/10] lg:aspect-[16/11] overflow-hidden rounded-[2.2rem] shadow-2xl"
                        >
                          <div className="absolute -inset-1 rounded-[2.4rem] border-2 border-white/30 transition-all duration-500 group-hover:-inset-0.5" />
                          <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] bg-orange-700/30">
                            <Image
                              src={getImageUrl(article.featuredImage?.url)}
                              alt={article.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 55vw, 50vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Pagination Indicators */}
            {newsData.length > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                {newsData.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => swiperRef.current?.slideTo(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? "w-8 bg-white"
                        : "w-2.5 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Single Fallback Event Card */
          <div className="overflow-hidden rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 lg:p-10 shadow-2xl">
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:gap-12">
              <div className="w-full lg:w-[48%] flex flex-col justify-center">
                <h3 className="text-3xl font-extrabold text-white md:text-4xl">
                  {rawEventData.title}
                </h3>
                <p className="mt-6 text-lg leading-relaxed text-white/90">
                  {rawEventData.description}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {rawEventData.buttons?.map((btn: Button, i: number) => (
                    <a
                      key={i}
                      href={btn.buttonLink}
                      className="rounded-full bg-white px-8 py-3.5 text-orange-600 font-bold shadow-lg hover:bg-orange-50 transition-all"
                    >
                      {btn.buttonText} →
                    </a>
                  ))}
                  <Link
                    href="/news"
                    className="rounded-full border border-white/30 bg-white/15 px-8 py-3.5 text-white font-bold backdrop-blur-sm hover:bg-white hover:text-orange-600 transition-all"
                  >
                    View All News →
                  </Link>
                </div>
              </div>
              {rawEventData.image?.url && (
                <div className="w-full lg:w-[52%] flex">
                  <div className="relative w-full min-h-[300px] sm:min-h-[380px] lg:min-h-[440px] aspect-[16/10] lg:aspect-[16/11] overflow-hidden rounded-[2.2rem] shadow-2xl">
                    <Image
                      src={getImageUrl(rawEventData.image.url)}
                      alt={rawEventData.title || "Event"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;

