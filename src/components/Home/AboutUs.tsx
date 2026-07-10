"use client";
import AboutUsImg from "@/assets/about-us.png";
import Image from "next/image";
import { FaArrowDown } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import Tag from "@/ui/Tag";
import { motion, useAnimation } from "framer-motion";
import parse from "html-react-parser";
import { getStrapiImageUrl } from "@/utils/getStrapiImageUrl";

// Define the props interface for AboutUs component
interface AboutUsProps {
  aboutUsData: any;
}

const AboutUs = ({ aboutUsData }: AboutUsProps) => {
  const [showMore, setShowMore] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const restRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  const aboutus = aboutUsData?.home?.aboutus;
  const image = aboutus?.image?.url
    ? getStrapiImageUrl(aboutus.image.url)
    : AboutUsImg;
  const tagTitle = aboutus?.tagTitle || "About Group";
  const heading =
    aboutus?.heading ||
    "The i-Capital Africa Institute: A Leading Business Consulting & Services Company";
  const description = aboutus?.description || "";

  // Helper to split description into paragraphs
  const getParagraphs = (desc: string) => {
    if (Array.isArray(desc)) {
      return desc.map((block: any, idx: number) =>
        block.children
          ? `<p class="mb-4 text-justify">${block.children.map((child: any) => child.text).join("")}</p>`
          : "",
      );
    }
    return desc.split(/\n+/).map((p) => `<p class="mb-4 text-justify">${p}</p>`);
  };

  const paragraphs = getParagraphs(description);
  const firstParagraph = paragraphs[0] || "";
  const restParagraphs = paragraphs.slice(1).join("");

  useEffect(() => {
    controls.start("visible");
    if (restRef.current) {
      setHeight(restRef.current.scrollHeight);
    }
  }, [controls, restParagraphs, showMore]);

  // Handle case where aboutUsData is not available
  if (!aboutUsData?.home?.aboutus) {
    return (
      <section className="bg-[#253E5E] px-6 py-16 md:px-12">
        <div className="text-center text-red-500">
          About Us data not available
        </div>
      </section>
    );
  }

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 24,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const buttonVariants = {
    initial: {
      scale: 1,
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    hover: {
      scale: 1.02,
      backgroundColor: "#ea580c", // orange-600
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a2e47] via-[#253E5E] to-[#1a2e47] px-6 py-20 md:px-12 md:py-32">
      {/* Background Decorative Elements */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-blue-400/5 blur-3xl" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="container relative z-10 mx-auto flex flex-col items-center gap-16 lg:flex-row"
      >
        {/* Image Section */}
        <motion.div variants={itemVariants} className="relative w-full lg:w-1/2">
          <div className="absolute -inset-4 rounded-[2rem] border border-white/10" />
          <motion.div
            variants={imageVariants}
            className="relative h-[300px] w-full overflow-hidden rounded-[2rem] shadow-2xl md:h-[500px]"
          >
            <Image
              src={image}
              alt={tagTitle}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Overlay Gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          variants={itemVariants}
          className="w-full text-justify lg:w-1/2"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Tag
              title={tagTitle}
              titleColor="text-[#F78019]"
              bgColor="bg-[#F7801926]"
            />
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="mt-4 text-xl font-bold leading-snug text-white md:text-4xl"
          >
            {heading}
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="mt-4 text-justify text-xs leading-loose text-gray-300 md:text-lg md:leading-relaxed"
          >
            {parse(firstParagraph)}
            {/* Animated expandable content */}
            <motion.div
              className="overflow-hidden"
              animate={{ height: showMore ? height : 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: showMore ? height : 0 }}
            >
              <div ref={restRef}>{parse(restParagraphs)}</div>
            </motion.div>
          </motion.div>

          {/* Learn More Button */}
          {restParagraphs && (
            <motion.div variants={itemVariants} className="mt-6">
              <motion.button
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={toggleShowMore}
                className="flex items-center gap-3 rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 md:px-8 md:py-4 md:text-base"
              >
                {showMore ? "Show Less" : "Learn More"}
                <motion.span
                  animate={{
                    rotate: showMore ? 180 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                >
                  <FaArrowDown className="text-xl" />
                </motion.span>
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AboutUs;
