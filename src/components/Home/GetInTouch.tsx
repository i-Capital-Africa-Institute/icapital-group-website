"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import LazyMap from "@/components/Map/LazyMap";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Please provide a subject"),
  message: z.string().min(10, "Message is too short"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const GetInTouch = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast.success("Message sent! We'll be in touch shortly.");
        reset();
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error("Failed to connect.");
    }
  };

  return (
    <section id="contact" className="relative bg-[#fcfcfd] py-24 lg:py-32 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[60px] md:blur-[120px]" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[60px] md:blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* LEFT COLUMN: Content & Form */}
          <div className="lg:col-span-7 xl:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mb-12"
            >
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-orange-500 mb-4">
                Let&apos;s Work Together
              </h2>
              <h1 className="text-5xl md:text-7xl font-black text-[#061C3D] tracking-tighter leading-[0.9] mb-6">
                Ready to elevate your <span className="text-orange-500">Business?</span>
              </h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed">
                Whether you have a specific inquiry or just want to explore possibilities, 
                our team is ready to help you navigate your journey.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(6,28,61,0.08)] border border-gray-100"
            >
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 ml-1">Full Name</label>
                    <input
                      {...register("name")}
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 text-[#061C3D] ring-1 ring-gray-100 focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                      placeholder="John Doe"
                    />
                    {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-gray-400 ml-1">Email Address</label>
                    <input
                      {...register("email")}
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 text-[#061C3D] ring-1 ring-gray-100 focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                      placeholder="john@example.com"
                    />
                    {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 ml-1">Subject</label>
                  <input
                    {...register("subject")}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-[#061C3D] ring-1 ring-gray-100 focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 ml-1">Message</label>
                  <textarea
                    {...register("message")}
                    rows={4}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-[#061C3D] ring-1 ring-gray-100 focus:ring-2 focus:ring-orange-500 transition-all outline-none resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="w-full bg-[#061C3D] text-white py-6 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl shadow-blue-900/10 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Contact Info & Map */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-8">
            {/* Quick Contact Cards */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-4"
            >
              <a href="tel:+251911629011" className="group flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="h-14 w-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Call Us</p>
                  <p className="text-lg font-bold text-[#061C3D]">+251 911 629 011</p>
                </div>
              </a>

              <a href="mailto:info@icapitalafrica.org" className="group flex items-center gap-6 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="h-14 w-14 rounded-2xl bg-[#061C3D] flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Email Us</p>
                  <p className="text-lg font-bold text-[#061C3D]">info@icapitalafrica.org</p>
                </div>
              </a>
            </motion.div>

            {/* Map Component */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[2.5rem] overflow-hidden h-[400px] shadow-2xl group border-4 border-white"
            >
              <LazyMap className="grayscale group-hover:grayscale-0 transition-all duration-700" />
              
              <div className="absolute inset-x-4 bottom-4 bg-[#061C3D]/90 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10">
                <h4 className="text-white font-bold text-lg mb-1">Addis Ababa, Ethiopia</h4>
                <p className="text-white/60 text-sm mb-4">i-Capital Africa Institute Headquarters</p>
                <button 
                  onClick={() => window.open("https://maps.app.goo.gl/zCmZ9LmY2EMySmS29", "_blank")}
                  className="flex items-center gap-2 text-orange-400 font-bold text-sm hover:text-orange-300 transition-colors"
                >
                  GET DIRECTIONS
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GetInTouch;