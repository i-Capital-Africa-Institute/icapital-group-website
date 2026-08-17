"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface GetStartedProps {
  getStartedData: any;
}

const GetStarted = ({ getStartedData }: GetStartedProps) => {
  if (!getStartedData?.home?.getStartedSection) {
    return null;
  }
  const section = getStartedData.home.getStartedSection;
  const heading = section.heading || "Ready to Transform Your Business?";
  const description = section.description || "Join us in shaping the future of business excellence with our expert solutions.";
  const buttonText = section.buttonText || "Get Started Today";
  const buttonLink = section.buttonLink || "#contact";

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Background with subtle animation */}
      <div className="absolute inset-0 bg-[#061C3D]" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -left-[10%] -top-[20%] h-[50%] w-[50%] rounded-full bg-orange-600/20 blur-3xl" />
        <div className="absolute -bottom-[20%] -right-[10%] h-[50%] w-[50%] rounded-full bg-blue-600/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-7xl lg:text-8xl leading-none">
            {heading.split('—').map((part: string, i: number) => (
              <span key={i} className={`block ${i === 1 ? 'mt-2 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent' : ''}`}>
                {part.trim()}
              </span>
            ))}
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-blue-100/60 md:text-xl">
            {description}
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
            {buttonLink.startsWith("#") ? (
              <a
                href={buttonLink}
                className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-orange-500 px-10 py-5 text-lg font-bold text-white transition-all duration-300 hover:bg-orange-600 hover:scale-105 hover:shadow-[0_20px_40px_rgba(249,115,22,0.3)]"
              >
                <span>{buttonText}</span>
                <svg 
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            ) : buttonLink.startsWith("/") ? (
              <Link
                href={buttonLink}
                className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-orange-500 px-10 py-5 text-lg font-bold text-white transition-all duration-300 hover:bg-orange-600 hover:scale-105 hover:shadow-[0_20px_40px_rgba(249,115,22,0.3)]"
              >
                <span>{buttonText}</span>
                <svg 
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            ) : (
              <a
                href={buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-orange-500 px-10 py-5 text-lg font-bold text-white transition-all duration-300 hover:bg-orange-600 hover:scale-105 hover:shadow-[0_20px_40px_rgba(249,115,22,0.3)]"
              >
                <span>{buttonText}</span>
                <svg 
                  className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            )}
            
            <Link 
              href="#about" 
              className="text-white/70 hover:text-white font-medium transition-colors duration-200"
            >
              Learn more about our vision →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GetStarted;

