"use client";

import Image from "next/image";
import Tag from "@/ui/Tag";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import parse from "html-react-parser";
import { getStrapiImageUrl } from "@/utils/getStrapiImageUrl";

function renderDescription(description: any) {
  if (typeof description === "string") {
    return parse(description);
  }
  if (Array.isArray(description)) {
    // Strapi blocks: join all children text
    return description.map((block: any, idx: number) =>
      block && Array.isArray(block.children) ? (
        <p key={idx}>
          {block.children.map((child: any) => child.text).join("")}
        </p>
      ) : null,
    );
  }
  return "";
}

// Define the props interface for Features component
interface FeaturesProps {
  featuresData: any;
}

const Features = ({ featuresData }: FeaturesProps) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  // Handle case where featuresData is not available
  if (!featuresData?.home?.features) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="text-center text-red-500">
          Features data not available
        </div>
      </section>
    );
  }

  const featuresSection = featuresData.home.features;
  const tagTitle = featuresSection?.tagTitle || "Features";
  const heading = featuresSection?.heading || "What Makes us Unique";
  const features = featuresSection?.features || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-24">
      {/* Background patterns */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: 'radial-gradient(#F78019 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} 
      />
      <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-orange-100/20 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-blue-50/30 blur-3xl" />

      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-3xl font-bold leading-snug text-gray-900 md:text-4xl"
          >
            {heading}
          </motion.h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-8"
        >
          {(features || []).map((feature: any, index: number) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative flex flex-col items-center rounded-[2.5rem] bg-white p-8 border border-gray-100 transition-all duration-500 hover:border-orange-200 hover:shadow-[0_30px_60px_-12px_rgba(247,128,25,0.12)]"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 transition-colors duration-500 group-hover:bg-orange-100">
                <div className="flex h-12 w-12 items-center justify-center">
                  {feature.icon?.url && (
                    <Image
                      src={getStrapiImageUrl(feature.icon.url)}
                      alt={feature.title}
                      width={48}
                      height={48}
                      className="h-full w-full object-contain text-orange-500"
                    />
                  )}
                </div>
              </div>

              <h3 className="mb-4 text-2xl font-bold tracking-tight text-[#061C3D] transition-colors duration-300 group-hover:text-[#F78019] text-center">
                {feature.title}
              </h3>

              <div className="leading-relaxed text-gray-500 text-base md:text-lg text-center text-justify">
                {renderDescription(feature.description)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
