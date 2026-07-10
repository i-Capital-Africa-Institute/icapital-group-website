"use client";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import Tag from "@/ui/Tag";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function ClientCard({
  client,
  logoImg,
  projectTitle,
}: {
  client: any;
  logoImg: string | StaticImageData;
  projectTitle: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12 flex justify-center"
    >
      <motion.div
        whileHover={{
          scale: 1.03,
          boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.18)",
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex w-full max-w-3xl flex-col items-center gap-10 overflow-hidden rounded-3xl p-12"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.85) 60%, rgba(255, 186, 120, 0.18) 100%)",
          border: "1.5px solid transparent",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.12)",
          backdropFilter: "blur(18px)",
          borderImage: "linear-gradient(120deg, #f78019 10%, #fff 90%) 1",
        }}
      >
        {/* Animated shimmer overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-3xl">
          <div className="animate-shimmer absolute left-[-60%] top-0 h-full w-2/3 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-40" />
        </div>
        {/* Decorative Gradient Circle with Animation */}
        <motion.div
          className="absolute -left-10 -top-10 z-0 h-40 w-40 rounded-full bg-orange-100 opacity-30 blur-2xl"
          animate={{ y: [0, 20, 0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Soft inner glow */}
        <div className="pointer-events-none absolute inset-0 z-0 rounded-3xl border-2 border-white/30 shadow-[0_0_60px_10px_rgba(255,255,255,0.18)]" />
        {/* Project Tag and Title */}
        <div className="z-20 flex w-full flex-col items-center">
          <Tag
            title="Project"
            titleColor="text-[#F78019]"
            bgColor="bg-[#F7801926]"
          />
          <h1 className="mt-2 text-center text-3xl font-bold md:text-4xl">
            {projectTitle}
          </h1>
        </div>
        {/* Logo */}
        <div className="relative z-20 mt-6 flex h-40 w-40 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-orange-100 bg-white/80 shadow-2xl">
          <Image
            src={logoImg || "/placeholder.svg"}
            alt={`${client.name} Logo`}
            width={150}
            height={150}
            className="h-32 w-32 object-contain"
          />
        </div>
        {/* Info */}
        <div className="relative z-20 flex-1 text-center">
          <p className="mb-2 text-2xl font-extrabold tracking-tight text-gray-900">
            {client.name}
          </p>
          <p className="mx-auto mb-2 max-w-xl text-base text-gray-600">
            {client.description}
          </p>
        </div>
        {/* Go back to Home link */}
        <div className="z-20 mt-6 flex w-full justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-2 text-base font-semibold text-white shadow-md transition hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            <FiArrowLeft className="text-lg" />
            Go back to Home
          </Link>
        </div>
        <style jsx>{`
          .animate-shimmer {
            animation: shimmer 2.5s infinite linear;
          }
          @keyframes shimmer {
            0% {
              left: -60%;
            }
            100% {
              left: 120%;
            }
          }
        `}</style>
      </motion.div>
    </motion.section>
  );
}
