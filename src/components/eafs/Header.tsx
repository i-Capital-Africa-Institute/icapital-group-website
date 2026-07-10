"use client";

import { FC, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  logo?: string | StaticImageData;
  linkColor?: string;
  linkActiveColor?: string;
  buttonBorderColor?: string;
  buttonTextColor?: string;
  mobileMenuBg?: string;
  headerBg?: string;
}

const Header: FC<HeaderProps> = ({
  logo = "/images/eafs-logo.png",
  linkColor = "#FFFFFF",
  linkActiveColor = "#FFFFFF",
  buttonBorderColor = "#FFFFFF",
  buttonTextColor = "#FFFFFF",
  mobileMenuBg = "bg-[#FCF7F1]",
  headerBg = "bg-transparent",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pathname, setPathname] = useState("");

  const navLinks = [
    { name: "Previous Summits", href: "/eafs/previous-summit" },
    { name: "Upcoming Summits", href: "/eafs/upcoming-summits" },
    { name: "Summit Documents", href: "/eafs/summit-documents" },
    { name: "Photo Gallery", href: "/eafs/photo-gallery" },
  ];

  useEffect(() => {
    setMounted(true);
    setPathname(window.location.pathname);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    if (!mounted) return false;
    return pathname === path;
  };

  const headerVariants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for smooth motion
      },
    },
  };

  const navItemVariants = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const contactButtonVariants = {
    initial: {
      scale: 1,
      boxShadow: "0 0 0 rgba(255, 255, 255, 0)",
    },
    pulse: {
      scale: [1, 1.02, 1],
      boxShadow: [
        "0 0 0 rgba(255, 255, 255, 0)",
        "0 0 15px rgba(255, 255, 255, 0.3)",
        "0 0 0 rgba(255, 255, 255, 0)",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  if (!mounted) {
    return null; // Return nothing on the server side
  }

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={headerVariants}
      className={` w-full ${headerBg} py-4 transition-all duration-300`}
    >
      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              href="/eafs"
              className="transition-opacity duration-300 hover:opacity-80"
            >
              <Image
                src={logo}
                alt="East African Finance Summit"
                width={150}
                height={90}
                priority
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navLinks.map((link, index) => {
              const active = isActive(link.href);
              return (
                <motion.div
                  key={link.name}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={navItemVariants}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className={`relative py-2 text-base font-medium transition-all duration-300 ${active ? "font-semibold" : ""} group`}
                    style={{
                      color: active ? linkActiveColor : linkColor,
                    }}
                  >
                    {link.name}
                    <span
                      className={`
      pointer-events-none absolute bottom-0 left-0 h-0.5 w-full origin-center scale-x-0 
      bg-[${linkActiveColor}] transition-transform duration-300 group-hover:scale-x-100
      ${active ? "scale-x-100" : ""}
    `}
                      style={{
                        backgroundColor: linkActiveColor,
                      }}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <div className="hidden md:block">
            <motion.div
              initial="initial"
              animate="pulse"
              variants={contactButtonVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.4)",
                transition: { duration: 0.2 },
              }}
            >
              <Link
                href="/#contact"
                className="rounded-full border-2 px-6 py-2 text-sm font-medium transition-all duration-300 hover:bg-white/10"
                style={{
                  borderColor: buttonBorderColor,
                  color: buttonTextColor,
                }}
              >
                Contact Us
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="flex items-center p-2 transition-opacity duration-300 hover:opacity-80 md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            style={{ color: linkColor }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: "auto",
                transition: {
                  height: {
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  },
                  opacity: {
                    duration: 0.3,
                    delay: 0.1,
                  },
                },
              }}
              exit={{
                opacity: 0,
                height: 0,
                transition: {
                  height: { duration: 0.3 },
                  opacity: { duration: 0.2 },
                },
              }}
              className={`mt-4 overflow-hidden rounded-lg ${mobileMenuBg} py-4 md:hidden`}
            >
              <nav className="flex flex-col space-y-4 px-4">
                {navLinks.map((link, index) => {
                  const active = isActive(link.href);
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.06,
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={link.href}
                        className={`py-2 text-base font-medium transition-colors duration-300 ${active ? "font-semibold" : ""}`}
                        style={{
                          color: active ? linkActiveColor : linkColor,
                          borderLeft: active
                            ? `3px solid ${linkActiveColor}`
                            : "none",
                          paddingLeft: active ? "8px" : "0",
                        }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: navLinks.length * 0.06,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(255, 255, 255, 0.4)",
                    transition: { duration: 0.2 },
                  }}
                >
                  <Link
                    href="/#contact"
                    className="w-full rounded-full border-2 px-6 py-2 text-center text-sm font-medium transition-all duration-300 hover:bg-white/10"
                    style={{
                      borderColor: buttonBorderColor,
                      color: buttonTextColor,
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
