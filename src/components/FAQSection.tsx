"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Calendar, CheckCircle2, Terminal } from "lucide-react";
import confetti from "canvas-confetti";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("01");
  const [selectedDate, setSelectedDate] = useState<number | null>(15);
  const [clientName, setClientName] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const faqs: FAQItem[] = [
    {
      id: "01",
      question: "WHAT ARE THE MAIN RENDERING SYSTEMS USED?",
      answer: "We prioritize Octane Render and Redshift for offline product/commercial renders, and Unreal Engine 5.5 (Lumen/Path Tracing) for spatial WebXR/virtual production sets. Custom Three.js/WebGL pipelines are compiled directly in TypeScript for interactive web portals."
    },
    {
      id: "02",
      question: "HOW LONG DOES A VOLUMETRIC CAPTURE ENGAGEMENT TAKE?",
      answer: "Typically, scoping and mapping take 1 week, shooting takes 2-3 days on-site, and reconstruction/optimization takes 2-3 weeks depending on the polygon complexity and rendering targets (e.g. Vision Pro, mobile, or web)."
    },
    {
      id: "03",
      question: "DO YOU ENGAGE IN SECURE SCIENTIFIC/MEDICAL VISUALIZATIONS?",
      answer: "Yes. We maintain strict compliance standards, executing local GPU computations to preserve sensitive telemetry data. We configure custom row-level security parameters via isolated PostgreSQL databases."
    }
  ];

  // Calendar setup for June 2026
  // June 1, 2026 is a Monday.
  const daysInJune = 30;
  const startOffset = 1; // 1 blank space for Sunday
  const daysOfWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  
  const calendarCells = [];
  // Add empty cells for Sunday offset
  for (let i = 0; i < startOffset; i++) {
    calendarCells.push({ day: null, disabled: true });
  }
  // Add June days
  for (let d = 1; d <= daysInJune; d++) {
    // Disable weekends for booking sync calls, or keep them selectable
    const isWeekend = (d + startOffset - 1) % 7 === 0 || (d + startOffset - 1) % 7 === 6;
    calendarCells.push({ day: d, disabled: isWeekend });
  }

  const handleBookCall = () => {
    if (!selectedDate || clientName.trim().length < 2) return;
    
    // Sanitize client name: remove any non-alphanumeric, spaces, dots, or dashes
    const sanitizedName = clientName.trim().replace(/[^a-zA-Z0-9.\-\s]/g, "");
    if (sanitizedName.length < 2) return;

    setClientName(sanitizedName);
    setBookingSuccess(true);
    
    // Play premium success confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#c5a880", "#ffffff", "#8c7353"]
    });

    setTimeout(() => {
      setBookingSuccess(false);
      setClientName("");
    }, 4500);
  };

  return (
    <section 
      id="faq" 
      className="snap-section relative flex items-center bg-[#050507] py-24 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      {/* 1. Immersive Tech-Grid Background Pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] select-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "45px 45px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 90%)",
        }}
      />

      {/* 2. Soft breathing gold ambient backdrop glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <motion.div 
          className="absolute right-[-10%] top-[10%] w-[60vw] h-[60vw] bg-[#c5a880]/[0.015] blur-[150px] rounded-full"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.7, 0.9, 0.7],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute left-[-15%] bottom-[-10%] w-[50vw] h-[50vw] bg-[#c5a880]/[0.008] blur-[140px] rounded-full"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch z-10">
        
        {/* Left Column: Glassmorphic FAQ Accordions (Common Queries) */}
        <div className="lg:col-span-6 flex flex-col justify-between w-full h-full gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase">
                  [ INTEL DIAGNOSTICS ]
                </span>
                <div className="w-6 h-[1px] bg-[#c5a880]/20" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-[0.1em] text-white uppercase">
                COMMON QUERIES
              </h2>
            </div>

            {/* Accordion container */}
            <div className="flex flex-col gap-4 mt-2">
              {faqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div 
                    key={faq.id} 
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    data-cursor={isOpen ? "close" : "expand query"}
                    className={`relative overflow-hidden rounded-sm border transition-all duration-500 group cursor-pointer p-5 sm:p-6 ${
                      isOpen
                        ? "border-[#c5a880]/25 bg-[#09090c]/80 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                        : "border-white/5 bg-[#09090c]/40 hover:border-white/10 hover:bg-[#09090c]/60"
                    }`}
                  >
                    {/* Glowing active neon gold indicator bar */}
                    {isOpen && (
                      <motion.div 
                        layoutId="activeFAQBar"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-[#c5a880] shadow-[0_0_12px_rgba(197,168,128,0.7)]"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}

                    <div className="flex justify-between items-center w-full text-left font-outfit text-xs sm:text-sm font-bold tracking-wider text-white">
                      <span className={`pr-4 transition-colors duration-300 font-mono ${isOpen ? "text-[#c5a880]" : "text-white/80 group-hover:text-[#c5a880]"}`}>
                        {faq.id}. {faq.question}
                      </span>
                      
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className={`w-6 h-6 border rounded-sm flex items-center justify-center shrink-0 transition-colors duration-300 ${
                          isOpen ? "border-[#c5a880] text-[#c5a880] bg-[#c5a880]/5" : "border-white/10 text-white/50 group-hover:border-white/20 group-hover:text-white"
                        }`}
                      >
                        {isOpen ? (
                          <Minus className="w-3 h-3" />
                        ) : (
                          <Plus className="w-3 h-3" />
                        )}
                      </motion.div>
                    </div>
                    
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="font-sans text-xs sm:text-[13px] text-[#9999aa] leading-relaxed pt-4 pr-2 pl-0.5">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit ticket trigger */}
          <div className="mt-2 pl-0.5">
            <a 
              href="#contact"
              data-cursor="open dossier"
              className="inline-block px-7 py-3.5 border border-white/10 hover:border-[#c5a880] hover:bg-[#c5a880]/5 text-white hover:text-[#c5a880] font-outfit text-[10px] tracking-[0.2em] font-semibold rounded-sm transition-all duration-300 shadow-sm"
            >
              SUBMIT INQUIRY TICKET
            </a>
          </div>
        </div>

        {/* Right Column: Cybernetic Scheduler Calendar (Sync Reservation) */}
        <div className="lg:col-span-6 flex flex-col justify-between w-full h-full gap-8 lg:items-end">
          <div className="flex flex-col gap-6 w-full max-w-[460px]">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase">
                  [ SYNC RESERVATION ]
                </span>
                <div className="w-6 h-[1px] bg-[#c5a880]/20" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-[0.1em] text-white uppercase">
                RESERVE SYNC CALL
              </h2>
            </div>

            {/* Calendar Box */}
            <div className="bg-[#09090c]/70 backdrop-blur-xl rounded-sm p-5 sm:p-6 border border-white/5 shadow-2xl relative flex flex-col justify-center min-h-[350px] w-full">
              {/* Scanline Glow Top Highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c5a880]/20 to-transparent pointer-events-none" />

              <AnimatePresence mode="wait">
                {bookingSuccess ? (
                  <motion.div 
                    className="flex flex-col items-center justify-center py-10 text-center relative"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {/* Glowing circular backdrop for checkmark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#c5a880]/[0.03] blur-[30px] rounded-full pointer-events-none" />

                    <motion.div
                      animate={{ scale: [0.8, 1.1, 1], rotate: [5, -5, 0] }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="z-10"
                    >
                      <CheckCircle2 className="w-14 h-14 text-[#c5a880] mb-4 drop-shadow-[0_0_12px_rgba(197,168,128,0.4)]" />
                    </motion.div>

                    <h3 className="font-outfit text-base font-extrabold tracking-[0.12em] text-gold-glow mb-2 uppercase z-10">
                      SLOT RESERVED
                    </h3>
                    
                    <div className="flex flex-col gap-1.5 items-center max-w-sm mt-1 z-10">
                      <p className="font-sans text-[13px] text-[#9999aa] leading-relaxed">
                        A secure sync invitation has been locked for:
                      </p>
                      <span className="font-mono text-xs text-white border border-[#c5a880]/30 px-3 py-1.5 bg-[#c5a880]/5 rounded-sm tracking-wider font-extrabold my-1 uppercase">
                        {clientName || "VISITOR"}
                      </span>
                      <span className="font-mono text-[10px] text-white/50 tracking-wider">
                        ON JUNE {selectedDate ? selectedDate.toString().padStart(2, "0") : "—"}, 2026
                      </span>
                      <p className="font-sans text-[11px] text-[#555566] leading-relaxed max-w-xs mt-1">
                        Please proceed to the dossier form below to complete verification and secure this slot.
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2 font-mono text-[9px] text-[#c5a880] tracking-widest opacity-80 uppercase z-10">
                      <Terminal className="w-3 h-3" />
                      <span>TELEMETRY SECURE // OK</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col justify-between h-full"
                  >
                    {/* Month header */}
                    <div className="flex justify-between items-center mb-5">
                      <span className="font-mono text-sm font-extrabold tracking-[0.2em] text-[#c5a880] uppercase">
                        JUNE MMXXVI
                      </span>
                      <span className="font-mono text-[9px] text-[#555566] tracking-wider uppercase flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
                        <span>TIMEZONE: IST (GMT+5:30)</span>
                      </span>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-1.5 mb-3 text-center text-[9px] font-mono font-bold text-[#6b7280] tracking-widest border-b border-white/5 pb-2">
                      {daysOfWeek.map((day) => (
                        <div key={day}>{day}</div>
                      ))}
                    </div>

                    {/* Days grid */}
                    <div className="grid grid-cols-7 gap-1.5">
                      {calendarCells.map((cell, idx) => {
                        if (cell.day === null) {
                          return <div key={`empty-${idx}`} className="aspect-square opacity-0 pointer-events-none" />;
                        }

                        const isSelected = selectedDate === cell.day;
                        const isDisabled = cell.disabled;

                        return (
                          <button
                            key={`day-${cell.day}`}
                            disabled={isDisabled}
                            onClick={() => setSelectedDate(cell.day)}
                            data-cursor={isDisabled ? undefined : `select june ${cell.day.toString().padStart(2, "0")}`}
                            className={`aspect-square relative font-mono text-[10px] sm:text-[11px] rounded-sm flex items-center justify-center focus:outline-none transition-all duration-300 cursor-pointer ${
                              isSelected 
                                ? "bg-[#c5a880] text-black font-extrabold shadow-[0_0_20px_rgba(197,168,128,0.4)] z-10" 
                                : isDisabled 
                                  ? "text-white/10 opacity-30 cursor-not-allowed" 
                                  : "text-white/80 border border-white/5 bg-white/[0.01] hover:border-[#c5a880]/30 hover:bg-[#c5a880]/5 hover:text-white"
                            }`}
                          >
                            {/* Breathing halo concentric indicator behind selected day */}
                            {isSelected && (
                              <span className="absolute -inset-1 rounded-sm border border-[#c5a880]/35 animate-ping opacity-60 pointer-events-none" />
                            )}
                            
                            {/* Micro-cross hatch line for disabled weekend days */}
                            {isDisabled && (
                              <span className="absolute inset-0 bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.05)_50%,transparent_55%)] pointer-events-none" />
                            )}
                            
                            {cell.day.toString().padStart(2, "0")}
                          </button>
                        );
                      })}
                    </div>

                    {/* Client Name Callsign Validation Input */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-1.5 text-left">
                      <label className="font-mono text-[8px] tracking-[0.2em] text-[#6b7280] uppercase block">
                        [ CLIENT CALLSIGN / ID NAME ] *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={40}
                        placeholder="ENTER YOUR FULL NAME OR ID CODE"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        data-cursor="type callsign"
                        className="w-full bg-[#050507]/60 border border-white/10 focus:border-[#c5a880]/40 text-white font-mono text-[10px] tracking-[0.15em] px-3 py-2.5 rounded-sm outline-none transition-all duration-300 placeholder-white/20 uppercase"
                      />
                    </div>

                    {/* Calendar CTA */}
                    <div className="border-t border-white/5 pt-4 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-left w-full sm:w-auto">
                        <span className="font-mono text-[9px] tracking-wider text-[#6b7280] uppercase block">
                          SELECTED DATE:
                        </span>
                        <span className="font-mono text-xs text-white font-bold tracking-widest">
                          JUNE {selectedDate ? selectedDate.toString().padStart(2, "0") : "—"}, 2026
                        </span>
                      </div>

                      <button
                        disabled={!selectedDate || clientName.trim().length < 2}
                        onClick={handleBookCall}
                        data-cursor={!selectedDate || clientName.trim().length < 2 ? undefined : "initialize call"}
                        className="w-full sm:w-auto px-6 py-3.5 bg-[#c5a880] disabled:bg-[#c5a880]/10 disabled:text-white/20 disabled:cursor-not-allowed text-black font-semibold font-outfit text-[11px] tracking-[0.18em] rounded-sm hover:bg-[#d8be99] hover:shadow-[0_0_20px_rgba(197,168,128,0.3)] transition-all duration-300 cursor-pointer"
                      >
                        INITIALIZE SYNC CALL
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
