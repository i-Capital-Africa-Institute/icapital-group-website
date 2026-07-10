"use client";

import Image from "next/image";
import IcapitalLogo from "@/assets/i-logo.png";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

type HeaderProps = {
  iconColor?: string;
};

const Header = ({ iconColor = "text-white" }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Scroll listener — rAF-throttled to avoid layout thrashing
  useEffect(() => {
    let raf = 0;
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ✅ Fix 2: Scroll lock with proper unmount cleanup
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }

    // Cleanup runs on unmount OR when menuOpen changes
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [menuOpen]);

  const mainLinks = [
    { name: "Group Sectors", href: "/#sectors" },
    { name: "About Group", href: "/#about" },
    { name: "Features", href: "/#features" },
    { name: "News and Updates", href: "/news" },
    { name: "Our Journey", href: "/#journey" },
    { name: "Portfolio", href: "/#portfolio" },
  ];

  const contactLink = { name: "Contact Us", href: "/#contact" };

  const navVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.08 * i,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  };

  const pulseAnimation = {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // ✅ Fix 3: Mobile link stagger variants
  const mobileNavVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.08 + 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    exit: (i: number) => ({
      opacity: 0,
      x: -20,
      transition: {
        delay: i * 0.03,
        duration: 0.3,
      },
    }),
  };

  // ✅ Fix 4: Overlay variants for AnimatePresence
  const overlayVariants = {
    hidden: {
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <>
      <header
        className={twMerge(
          "fixed left-0 top-0 z-[100] w-full transition-[background-color,box-shadow] duration-300 pl-0 pr-4 py-2 md:pr-10",
          scrolled
            ? "bg-[#061C3D] shadow-lg border-b border-white/5"
            : "bg-transparent"
        )}
      >
        <div className="flex w-full items-center justify-between">
          {/* Logo — scaled to crop asset padding; origin-left removes empty left space */}
          <Link
            href="/"
            aria-label="Home"
            className="-ml-2 block h-14 w-44 flex-shrink-0 overflow-hidden sm:h-16 sm:w-56 lg:h-[4.5rem] lg:w-64"
          >
            <Image
              src={IcapitalLogo}
              alt="i-Capital Africa Institute"
              width={500}
              height={500}
              sizes="(max-width: 640px) 176px, (max-width: 1024px) 224px, 256px"
              className={twMerge(
                "h-full w-auto max-w-none scale-[2.4] origin-left object-contain object-left",
                iconColor === "text-black" ? "" : "brightness-0 invert",
              )}
              style={{ width: "auto", height: "100%" }}
              priority
            />
          </Link>
 {/* Desktop Nav — shows at lg+ (1024px) for tablet landscape and up */}
          <nav
            className={twMerge(
              "hidden flex-1 items-center justify-center space-x-5 lg:space-x-7 xl:space-x-10",
              "text-sm font-bold tracking-tight lg:flex lg:text-[15px] transition-colors duration-300",
              iconColor
            )}
          >
            {mainLinks.map((link, i) => (
              <motion.div
                key={link.name}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={navVariants}
              >
                <Link
                  href={link.href}
                  className="group relative px-2 py-1 transition-colors duration-300 hover:text-orange-300"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-orange-300 transition-all duration-300 group-hover:w-full" />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Contact button — shows at lg+ */}
          <div className="hidden flex-shrink-0 items-center justify-end lg:flex">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
            >
              <motion.div
                initial="initial"
                animate="animate"
                variants={pulseAnimation}
              >
                <Link
                  href={contactLink.href}
                  className="ml-6 rounded-full bg-orange-500 hover:bg-orange-600 px-8 py-3 text-sm font-black tracking-widest uppercase text-white shadow-[0_10px_20px_-5px_rgba(249,115,22,0.4)] transition-all duration-300 hover:scale-105"
                >
                  {contactLink.name}
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Burger button — tablet and mobile (below lg) */}
          <button
            className="ml-auto p-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:scale-105 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 8h16M4 16h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/*
       * ✅ Fix 8: Overlay is OUTSIDE <header> — fixes z-index stacking context trap
       * ✅ Fix 9: No lg:hidden on overlay — AnimatePresence handles show/hide
       * ✅ Fix 10: True blue-black blur — semi-transparent bg + backdrop-blur
       */}
      <AnimatePresence mode="wait">
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            ref={overlayRef}
            key="mobile-menu-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-[999] flex flex-col lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/*
             * ✅ Fix 11: True blurred blue-black background
             * - bg is semi-transparent so backdrop-blur actually works
             * - backdrop-blur-2xl blurs the page content behind
             * - The result is a frosted blue-black glass effect
             */}
            <div className="absolute inset-0 bg-[#020d1a]/80 backdrop-blur-2xl" />

            {/* Blue-black color tint overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#061C3D]/60 via-[#030d1f]/70 to-[#000510]/80" />
{/* Decorative ambient glows */}
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
            <div className="absolute -right-20 bottom-40 h-72 w-72 rounded-full bg-indigo-900/20 blur-3xl pointer-events-none" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#061C3D]/20 blur-3xl pointer-events-none" />

            {/* Content container */}
            <div className="relative flex h-full flex-col px-6 py-6 md:px-12">
              {/* Header row */}
              <div className="flex items-center justify-between mb-16">
                <div className="block h-14 w-44 overflow-hidden sm:h-16 sm:w-56">
                  <Image
                    src={IcapitalLogo}
                    alt="i-Capital Africa Institute"
                    width={500}
                    height={500}
                    sizes="224px"
                    className="h-full w-auto max-w-none scale-[2.4] origin-left object-contain object-left brightness-0 invert"
                    style={{ width: "auto", height: "100%" }}
                  />
                </div>

                {/* Close button */}
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/15 hover:border-white/25 hover:scale-105 transition-all duration-300"
                  aria-label="Close menu"
                >
                  <svg
                    className="h-7 w-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col space-y-1">
                {mainLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={mobileNavVariants}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={twMerge(
                        "group flex items-center gap-3 py-4 px-4 rounded-2xl",
                        "text-2xl md:text-3xl font-black tracking-tighter text-white/90",
                        "hover:text-orange-400 hover:bg-white/5 hover:translate-x-2",
                        "border border-transparent hover:border-white/10",
                        "transition-all duration-300"
                      )}
                    >
                      {/* Animated dot indicator */}
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Contact CTA — pinned to bottom */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.55, duration: 0.5, ease: "easeOut" }}
                className="mt-auto pb-8 md:pb-12"
              >
                {/* Divider */}
                <div className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
<Link
                  href={contactLink.href}
                  onClick={() => setMenuOpen(false)}
                  className={twMerge(
                    "block w-full rounded-2xl py-5 text-center",
                    "text-xl font-black tracking-wide text-white uppercase",
                    "bg-gradient-to-r from-orange-500 to-orange-600",
                    "shadow-[0_20px_40px_-10px_rgba(249,115,22,0.35)]",
                    "hover:shadow-[0_20px_50px_-10px_rgba(249,115,22,0.55)]",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    "transition-all duration-300"
                  )}
                >
                  {contactLink.name}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;