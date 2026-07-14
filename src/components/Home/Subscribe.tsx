"use client";

import { motion, HTMLMotionProps, AnimatePresence } from "framer-motion";
import { useMutation } from "@apollo/client";
import { CREATE_SUBSCRIBER } from "@/graphql/home/home";
import { useState, useEffect } from "react";
import {
  subscriberSchema,
  type SubscriberFormData,
} from "@/lib/validations/subscriber";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ClientOnly from "@/components/ClientOnly";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

// Helper to highlight words in heading
function highlightWords(text: string, highlight: string) {
  if (!highlight) return text;
  // Escape special regex characters in highlight
  const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="text-orange-400">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

// Define the props interface for Subscribe component
interface SubscribeProps {
  subscribeData: any;
}

const SubscribeInner = ({ subscribeData }: SubscribeProps) => {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const [createSubscriber] = useMutation(CREATE_SUBSCRIBER);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubscriberFormData>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: {
      email: "",
      consent: false,
      source: "website",
    },
  });

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => {
        setMessage("");
        setStatus("idle");
      }, 5000); // 5 seconds

      // Cleanup timer on unmount or when status/message changes
      return () => clearTimeout(timer);
    }
  }, [status, message]);

  // Handle case where subscribeData is not available
  if (!subscribeData?.home?.subscribeSection) {
    return (
      <section className="bg-[#253E5E] px-6 py-16 md:px-12">
        <div className="text-center text-red-500">
          Subscribe data not available
        </div>
      </section>
    );
  }

  const section = subscribeData.home.subscribeSection;
  const heading = section.heading || "with Our News & Announcements!";
  const highlight = section.highlight || "Get Updated";
  const description = section.description || "Subscribe to our newsletter!";
  const emailPlaceholder = section.emailPlaceholder || "Your email";
  const buttonText = section.buttonText || "Subscribe";

  const onSubmit = async (formData: SubscriberFormData) => {
    setStatus("loading");
    try {
      await createSubscriber({
        variables: {
          data: {
            email: formData.email,
            statusType: "active",
            subscribedAt: new Date().toISOString(),
            consent: formData.consent,
            source: formData.source,
          },
        },
      });
      setStatus("success");
      setMessage("Thank you for subscribing!");
      toast.success("Thank you for subscribing!");
      reset();
    } catch (err: any) {
      console.error("Subscription error:", err);
      setStatus("error");

      // Extract meaningful error message from Apollo Client error
      let errorMessage = "Something went wrong. Please try again.";

      // Check for timeout errors first
      if (
        err.name === "TimeoutError" ||
        err.code === 23 ||
        err.message?.toLowerCase().includes("timeout")
      ) {
        errorMessage =
          "Request timed out. The server is taking too long to respond. Please try again later.";
        setMessage(errorMessage);
        toast.error(errorMessage);
        return;
      }

      // Function to check if error is about duplicate email
      const isDuplicateError = (text: string) => {
        const lower = text.toLowerCase();
        return (
          lower.includes("unique") ||
          lower.includes("duplicate") ||
          lower.includes("already exists") ||
          lower.includes("already subscribed") ||
          lower.includes("constraint")
        );
      };

      // Check for GraphQL errors
      if (err.graphQLErrors && err.graphQLErrors.length > 0) {
        const graphQLError = err.graphQLErrors[0];

        // Check Strapi's error structure in extensions
        if (graphQLError.extensions?.error) {
          const strapiError = graphQLError.extensions.error;

          // Check if it's a validation error about uniqueness
          if (strapiError.message && isDuplicateError(strapiError.message)) {
            errorMessage =
              "This email is already subscribed to our newsletter.";
          }
          // Check validation details
          else if (strapiError.details?.errors) {
            const validationError = strapiError.details.errors.find(
              (e: any) =>
                e.path?.includes("email") && isDuplicateError(e.message || ""),
            );
            if (validationError) {
              errorMessage =
                "This email is already subscribed to our newsletter.";
            } else if (
              strapiError.message &&
              strapiError.message !== "Internal Server Error"
            ) {
              errorMessage = strapiError.message;
            }
          }
          // Use the strapi error message if not internal server error
          else if (
            strapiError.message &&
            strapiError.message !== "Internal Server Error"
          ) {
            errorMessage = strapiError.message;
          }
        }

        // Fallback to checking the main error message
        const originalError = graphQLError.message || "";
        if (
          errorMessage === "Something went wrong. Please try again." &&
          originalError &&
          originalError !== "Internal Server Error"
        ) {
          if (isDuplicateError(originalError)) {
            errorMessage =
              "This email is already subscribed to our newsletter.";
          } else {
            errorMessage = originalError;
          }
        }
      }

      // Check for network errors
      if (err.networkError) {
        // Check if network error contains response data with errors
        if (err.networkError.result?.errors) {
          const networkError = err.networkError.result.errors[0];

          if (networkError?.extensions?.error) {
            const strapiError = networkError.extensions.error;
            if (strapiError.message && isDuplicateError(strapiError.message)) {
              errorMessage =
                "This email is already subscribed to our newsletter.";
            }
          }
        }

        // If we still have generic message, set network error message
        if (errorMessage === "Something went wrong. Please try again.") {
          errorMessage =
            "Network error. Please check your connection and try again.";
        }
      }

      // Fallback to general error message
      if (
        err.message &&
        errorMessage === "Something went wrong. Please try again."
      ) {
        if (isDuplicateError(err.message)) {
          errorMessage = "This email is already subscribed to our newsletter.";
        } else if (err.message !== "Internal Server Error") {
          errorMessage = err.message;
        }
      }

      setMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-[#061C3D] px-6 py-20 md:px-12">
      {/* Decorative Background Blobs */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-orange-500/10 blur-[100px]" />
      <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative mx-auto max-w-6xl rounded-[3rem] bg-white/5 p-8 md:p-16 backdrop-blur-xl border border-white/10 shadow-2xl"
      >
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-extrabold leading-tight text-white md:text-5xl"
            >
              {highlightWords(heading, highlight)}
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg tracking-wide text-gray-300 md:text-xl"
            >
              {description}
            </motion.p>
          </div>

          {/* Form Content */}
          <motion.div
            variants={itemVariants}
            className="w-full max-w-lg"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="relative">
                <div className="flex overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl transition-all duration-300 focus-within:ring-4 focus-within:ring-orange-500/20">
                  <input
                    type="email"
                    {...register("email")}
                    placeholder={emailPlaceholder}
                    className="w-full bg-transparent px-6 py-4 text-lg text-gray-900 focus:outline-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={status === "loading"}
                    className="flex shrink-0 items-center justify-center rounded-xl bg-orange-500 px-8 py-4 font-bold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
                  >
                    {status === "loading" ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      buttonText
                    )}
                  </motion.button>
                </div>
                
                <AnimatePresence>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-4 top-full mt-2 text-sm font-medium text-red-400"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="relative flex h-6 items-center">
                    <input
                      type="checkbox"
                      id="consent"
                      {...register("consent")}
                      className="h-5 w-5 cursor-pointer rounded border-white/20 bg-white/10 text-orange-500 focus:ring-orange-500 focus:ring-offset-[#061C3D]"
                    />
                  </div>
                  <label htmlFor="consent" className="cursor-pointer text-sm font-medium text-gray-400 transition-colors group-hover:text-gray-200">
                    I agree to receive marketing emails and news updates
                  </label>
                </div>
                
                <AnimatePresence>
                  {errors.consent && (
                    <motion.p
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-medium text-red-400"
                    >
                      {errors.consent.message}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                {message && (
                  <motion.div
                    key="message"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`rounded-xl p-4 text-center text-sm font-bold ${
                      status === "success" 
                        ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

const Subscribe = (props: SubscribeProps) => (
  <ClientOnly fallback={<SectionSkeleton minHeight="min-h-[300px]" />}>
    <SubscribeInner {...props} />
  </ClientOnly>
);

export default Subscribe;
