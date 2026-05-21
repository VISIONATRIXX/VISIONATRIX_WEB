"use client";

import { motion } from "framer-motion";

export default function StudioSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const }
    }
  };

  const textRevealVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  return (
    <section 
      id="studio" 
      className="snap-section flex items-center bg-[#050507] py-24 px-6 md:px-12 lg:px-24"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-[10%] bottom-[20%] w-[50vw] h-[50vw] bg-[#c5a880]/2 opacity-[0.03] blur-[130px] rounded-full" />
      </div>

      <motion.div 
        className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Left Side: Metadata Panel */}
        <motion.div 
          className="lg:col-span-4 border-l border-[#c5a880]/20 pl-6 md:pl-8 flex flex-col gap-8"
          variants={itemVariants}
        >
          <div>
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase block mb-6">
              [ STUDIO PROFILE ]
            </span>
          </div>

          <div className="flex flex-col gap-5">
            {/* Established */}
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#6b7280] uppercase">
                ESTABLISHED:
              </span>
              <span className="font-mono text-base tracking-[0.1em] text-white font-semibold uppercase">
                MMXXVI
              </span>
            </div>

            {/* Locations */}
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#6b7280] uppercase">
                LOCATIONS:
              </span>
              <span className="font-mono text-xs tracking-[0.05em] text-white/90">
                Bengaluru × Mumbai × Delhi
              </span>
            </div>

            {/* Focus */}
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#6b7280] uppercase">
                FOCUS:
              </span>
              <span className="font-mono text-xs tracking-[0.05em] text-white/90">
                Premium Sensory Architectures
              </span>
            </div>

            {/* Delivery */}
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] tracking-[0.2em] text-[#6b7280] uppercase">
                DELIVERY:
              </span>
              <span className="font-mono text-xs tracking-[0.05em] text-white/90">
                CGI, VFX & Volumetric Systems
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Philosophy & Big Text Statement */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Main big statement with staggered word reveals */}
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.06em] leading-[1.2] text-white flex flex-wrap gap-x-3 gap-y-1">
            {"WE ENGINEER DIGITAL LANDMARKS THAT COMMAND HUMAN RESONANCE.".split(" ").map((word, wordIndex) => {
              const isGold = word === "LANDMARKS" || word === "RESONANCE.";
              return (
                <span key={wordIndex} className="inline-block overflow-hidden py-1">
                  <motion.span
                    initial={{ y: "105%", opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      delay: wordIndex * 0.06,
                      duration: 0.8,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className={`inline-block ${isGold ? "text-[#c5a880] text-gold-glow" : ""}`}
                  >
                    {word}
                  </motion.span>
                </span>
              );
            })}
          </h2>

          {/* Subtext description with fast word stagger reveal */}
          <p className="font-sans text-sm sm:text-base md:text-lg leading-relaxed text-[#9999aa] max-w-3xl flex flex-wrap gap-x-1.5 gap-y-0.5">
            {"Our philosophy is defined by intent, not algorithm. We reject generic, template-driven interfaces to hand-craft high-fidelity, scroll-driven interactive ecosystems that elevate world-class brands into permanent sensory landmarks.".split(" ").map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block overflow-hidden py-0.5">
                <motion.span
                  initial={{ y: "105%", opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{
                    delay: 0.15 + wordIndex * 0.015,
                    duration: 0.65,
                    ease: [0.25, 1, 0.5, 1]
                  }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
