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
            <span className="font-sans text-[10px] tracking-[0.25em] text-[#c5a880] uppercase block mb-6">
              [ STUDIO PROFILE ]
            </span>
          </div>

          <div className="flex flex-col gap-5">
            {/* Established */}
            <div className="flex flex-col gap-1">
              <span className="font-sans text-[9px] tracking-[0.2em] text-[#6b7280] uppercase">
                ESTABLISHED:
              </span>
              <span className="font-display text-base tracking-[0.1em] text-white font-semibold uppercase">
                MMXXVI
              </span>
            </div>

            {/* Locations */}
            <div className="flex flex-col gap-1">
              <span className="font-sans text-[9px] tracking-[0.2em] text-[#6b7280] uppercase">
                LOCATIONS:
              </span>
              <span className="font-sans text-xs tracking-[0.05em] text-white/90">
                Bengaluru × Mumbai × Delhi
              </span>
            </div>

            {/* Focus */}
            <div className="flex flex-col gap-1">
              <span className="font-sans text-[9px] tracking-[0.2em] text-[#6b7280] uppercase">
                FOCUS:
              </span>
              <span className="font-sans text-xs tracking-[0.05em] text-white/90">
                Premium Sensory Architectures
              </span>
            </div>

            {/* Delivery */}
            <div className="flex flex-col gap-1">
              <span className="font-sans text-[9px] tracking-[0.2em] text-[#6b7280] uppercase">
                DELIVERY:
              </span>
              <span className="font-sans text-xs tracking-[0.05em] text-white/90">
                CGI, VFX & Volumetric Systems
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Philosophy & Big Text Statement */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Main big statement */}
          <motion.h2 
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.06em] leading-[1.2] text-white"
            variants={textRevealVariants}
          >
            WE ENGINEER DIGITAL <span className="text-[#c5a880] text-gold-glow">LANDMARKS</span> THAT COMMAND HUMAN <span className="text-[#c5a880] text-gold-glow">RESONANCE.</span>
          </motion.h2>

          {/* Subtext description */}
          <motion.p 
            className="font-sans text-sm sm:text-base md:text-lg leading-relaxed text-[#9999aa] max-w-3xl"
            variants={itemVariants}
          >
            Our philosophy is defined by intent, not algorithm. We reject generic, template-driven interfaces to hand-craft high-fidelity, scroll-driven interactive ecosystems that elevate world-class brands into permanent sensory landmarks.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
