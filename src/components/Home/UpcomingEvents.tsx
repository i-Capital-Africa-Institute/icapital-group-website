"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getStrapiImageUrl } from "@/utils/getStrapiImageUrl";
interface Button {
  buttonText: string;
  buttonLink: string;
}

interface UpcomingEvent {
  title: string;
  tagTitle: string;
  description: string;
  image: {
    url: string;
    width: number;
    height: number;
  };
  buttons: Button[];
}

const tagVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

const titleVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: "easeOut", delay: 0.1 },
  },
};

const descriptionVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: "easeOut", delay: 0.2 },
  },
};

const buttonContainerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } },
};

// Define the props interface for UpcomingEvents component
interface UpcomingEventsProps {
  upcomingEventsData: any;
}

const UpcomingEvents = ({ upcomingEventsData }: UpcomingEventsProps) => {
  // Handle case where upcomingEventsData is not available
  if (!upcomingEventsData?.home?.upcomingEvents) {
    return (
      <section className="w-full bg-orange-500 px-2 md:px-8">
        <div className="text-center text-red-500">
          Upcoming Events data not available
        </div>
      </section>
    );
  }

  const eventData = upcomingEventsData.home.upcomingEvents;

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-orange-500 via-orange-500 to-orange-600 py-16 md:py-24">
      {/* Decorative Background Elements */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-orange-400/20 blur-3xl opacity-50" />
      
      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:gap-20">
          {/* Text Content */}
          <div className="w-full lg:w-3/5">
            {/* Tag */}
            <motion.div
              variants={tagVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="inline-block rounded-full bg-white/20 px-5 py-1.5 backdrop-blur-md border border-white/10"
            >
              <span className="text-sm font-semibold tracking-wide text-white uppercase">
                {eventData.tagTitle}
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={titleVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-6 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl"
            >
              {eventData.title}
            </motion.h2>

            {/* Description - Justified text */}
            <motion.p
              variants={descriptionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-6 text-lg leading-relaxed text-white/90 md:text-xl lg:max-w-2xl text-justify"
            >
              {eventData.description}
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={buttonContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mt-10 flex flex-wrap items-center gap-6"
            >
              {eventData.buttons.map((button: Button, index: number) => (
                <motion.div
                  key={index}
                  variants={buttonVariants}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <a
                    href={button.buttonLink}
                    className={`flex items-center gap-3 transition-all duration-300 ${
                      index === 0
                        ? "rounded-full bg-white px-8 py-3.5 text-orange-500 font-bold shadow-xl hover:bg-orange-50 lg:px-10 lg:py-4"
                        : "text-white font-semibold hover:text-white/80 border-b-2 border-transparent hover:border-white transition-all"
                    }`}
                  >
                    <span>{button.buttonText}</span>
                    {index === 0 && (
                      <span className="text-xl">→</span>
                    )}
                  </a>
                </motion.div>
              ))}
              {/* New View All News Button */}
              <motion.div
                variants={buttonVariants}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href="/news"
                  className="flex items-center gap-3 transition-all duration-300 rounded-full bg-white/10 px-8 py-3.5 text-white font-bold border border-white/20 backdrop-blur-sm shadow-xl hover:bg-white hover:text-orange-500 lg:px-10 lg:py-4"
                >
                  <span>View All News</span>
                  <span className="text-xl">→</span>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Image Section - Fit inside card */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-2/5"
          >
            <div className="group relative aspect-[16/9] w-full overflow-hidden rounded-[2.5rem] shadow-2xl sm:aspect-[4/3] lg:aspect-[16/9]">
              <div className="absolute -inset-4 rounded-[3rem] border-2 border-white/20 transition-all duration-500 group-hover:-inset-2" />
              <div className="relative h-full w-full overflow-hidden">
                <Image
                  src={getStrapiImageUrl(eventData.image.url)}
                  alt={eventData.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
