"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating: number;
}

export default function FeedbackSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      quote: "The spatial environment crafted by Visionatrix redefined how luxury buyers interact with our brand. An absolute benchmark of creative technology.",
      author: "MARCUS VANE",
      role: "HEAD OF DIGITAL CREATIVE",
      company: "LEICA CAMERA AG CONCEPT",
      rating: 5
    },
    {
      quote: "Their mathematical approach to shader art and VFX resulted in an automotive spec showcase that exceeded our absolute highest aesthetic standards.",
      author: "ELENA ROSTOVA",
      role: "VP OF INNOVATION MARKETING",
      company: "MERCEDES BENZ DESIGN",
      rating: 5
    },
    {
      quote: "Bespoke engineering from start to finish. They built a custom WebGL portal that runs at a locked 60fps while displaying millions of active data nodes.",
      author: "DR. ARIS THORNE",
      role: "CHIEF ARCHITECT",
      company: "NEURAL NETWORK CO.",
      rating: 5
    }
  ];

  const clientLogos = [
    "MERCEDES BENZ",
    "LEICA CAMERA",
    "SAINT LAURENT",
    "APEX RACING",
    "LUMINANCE",
    "NEURAL NET",
    "MERCEDES BENZ",
    "LEICA CAMERA",
    "SAINT LAURENT",
    "APEX RACING",
    "LUMINANCE",
    "NEURAL NET"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section 
      id="feedback" 
      className="snap-section flex flex-col justify-between bg-[#050507] py-20 px-6 md:px-12 lg:px-24"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-[10%] bottom-[10%] w-[50vw] h-[50vw] bg-[#c5a880]/2 opacity-[0.02] blur-[150px] rounded-full" />
      </div>

      {/* Top Spacer */}
      <div className="h-10" />

      {/* Main Testimonial Block */}
      <div className="max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
        
        {/* Left Side: Labels */}
        <div className="lg:col-span-4 flex flex-col gap-2">
          <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase">
            [ AUDITED SATISFACTION ]
          </span>
          <h2 className="font-display text-3xl font-bold tracking-[0.1em] text-white uppercase">
            RESONANCE
          </h2>
        </div>

        {/* Right Side: Slideshow */}
        <div className="lg:col-span-8 relative">
          <div className="min-h-[220px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-6"
              >
                {/* Rating Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#c5a880] text-[#c5a880]" />
                  ))}
                </div>

                {/* Big Quote */}
                <p className="font-sans text-xl sm:text-2xl md:text-3xl italic font-medium leading-relaxed text-white tracking-wide max-w-4xl">
                  "{testimonials[activeIndex].quote}"
                </p>

                {/* Author Info */}
                <div className="flex flex-col gap-1 border-l-2 border-[#c5a880] pl-4 mt-2">
                  <span className="font-outfit text-xs font-bold tracking-[0.2em] text-white uppercase">
                    {testimonials[activeIndex].author}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#6b7280]">
                    {testimonials[activeIndex].role} // {testimonials[activeIndex].company}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeIndex 
                    ? "bg-[#c5a880]" 
                    : "bg-white/10 hover:bg-[#c5a880]/50"
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Infinite Horizontal Logo Marquee */}
      <div className="w-full border-t border-white/5 py-8 mt-12 overflow-hidden relative z-10 bg-black/20">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050507] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050507] to-transparent z-20 pointer-events-none" />

        <div className="flex w-max animate-marquee whitespace-nowrap gap-16 select-none">
          {/* Logo set duplicated to loop seamlessly */}
          <div className="flex items-center gap-16 text-center font-display text-xs md:text-sm tracking-[0.3em] font-semibold text-[#3b3b4d]">
            {clientLogos.map((logo, idx) => (
              <span key={idx} className="hover:text-white transition-colors duration-300">
                {logo}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-16 text-center font-display text-xs md:text-sm tracking-[0.3em] font-semibold text-[#3b3b4d]">
            {clientLogos.map((logo, idx) => (
              <span key={`dup-${idx}`} className="hover:text-white transition-colors duration-300">
                {logo}
              </span>
            ))}
          </div>
        </div>

        {/* CSS for custom infinite scrolling marquee */}
        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            animation: marquee 25s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>

    </section>
  );
}
