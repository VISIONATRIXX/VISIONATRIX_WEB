"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Calendar, CheckCircle2 } from "lucide-react";
import confetti from "canvas-confetti";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("01");
  const [selectedDate, setSelectedDate] = useState<number | null>(15);
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
    if (!selectedDate) return;
    setBookingSuccess(true);
    
    // Play premium success confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#c5a880", "#ffffff", "#8c7353"]
    });

    setTimeout(() => {
      setBookingSuccess(false);
    }, 4000);
  };

  return (
    <section 
      id="faq" 
      className="snap-section flex items-center bg-[#050507] py-20 px-6 md:px-12 lg:px-24"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute right-[5%] top-[10%] w-[45vw] h-[45vw] bg-[#c5a880]/2 opacity-[0.02] blur-[140px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start z-10">
        
        {/* Left Column: Accordions (Common Queries) */}
        <div className="lg:col-span-6 flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase">
              [ GENERAL RESOLUTIONS ]
            </span>
            <h2 className="font-display text-3xl font-bold tracking-[0.1em] text-white uppercase">
              COMMON QUERIES
            </h2>
          </div>

          {/* Accordion container */}
          <div className="flex flex-col gap-3 mt-4">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div 
                  key={faq.id} 
                  className="border-b border-white/5 pb-4 transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="flex justify-between items-center w-full text-left font-outfit text-xs sm:text-sm font-bold tracking-wider py-3 text-white hover:text-[#c5a880] transition-colors duration-300 focus:outline-none cursor-pointer"
                  >
                    <span className="pr-4">{faq.id}. {faq.question}</span>
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-[#c5a880] shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-[#c5a880] shrink-0" />
                    )}
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="font-sans text-xs sm:text-sm text-[#9999aa] leading-relaxed pt-2 pr-4">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Submit ticket trigger */}
          <div className="mt-4">
            <a 
              href="#contact"
              className="inline-block px-6 py-3 border border-white/10 hover:border-[#c5a880] text-white hover:text-[#c5a880] font-outfit text-[10px] tracking-[0.2em] font-semibold rounded-sm transition-all duration-300"
            >
              SUBMIT INQUIRY TICKET
            </a>
          </div>
        </div>

        {/* Right Column: Dynamic Scheduler */}
        <div className="lg:col-span-6 flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase">
              [ SYNC RESERVATION ]
            </span>
            <h2 className="font-display text-3xl font-bold tracking-[0.1em] text-white uppercase">
              RESERVE SYNC CALL
            </h2>
          </div>

          {/* Calendar Box */}
          <div className="glass-card rounded-md p-6 border border-white/5 relative">
            <AnimatePresence mode="wait">
              {bookingSuccess ? (
                <motion.div 
                  className="flex flex-col items-center justify-center py-12 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <CheckCircle2 className="w-12 h-12 text-[#c5a880] mb-4 drop-shadow-[0_0_10px_rgba(197,168,128,0.2)]" />
                  <h3 className="font-outfit text-base font-bold tracking-[0.1em] text-white mb-2 uppercase">
                    SLOT RESERVED
                  </h3>
                  <p className="font-sans text-xs text-[#9999aa] max-w-xs leading-relaxed">
                    A secure sync invitation has been compiled for <span className="text-[#c5a880] font-semibold">June {selectedDate}, 2026</span>. Please fill the contact dossier below to lock the time.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Month header */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="font-mono text-sm font-bold tracking-[0.2em] text-[#c5a880] uppercase">
                      JUNE MMXXVI
                    </span>
                    <span className="font-mono text-[9px] text-[#555566] tracking-wider uppercase flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
                      <span>TIMEZONE: IST (GMT+5:30)</span>
                    </span>
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-2 mb-3 text-center text-[9px] font-mono font-semibold text-[#555566] tracking-widest">
                    {daysOfWeek.map((day) => (
                      <div key={day}>{day}</div>
                    ))}
                  </div>

                  {/* Days grid */}
                  <div className="calendar-grid">
                    {calendarCells.map((cell, idx) => {
                      if (cell.day === null) {
                        return <div key={`empty-${idx}`} className="calendar-day empty-day opacity-0 pointer-events-none" />;
                      }

                      const isSelected = selectedDate === cell.day;
                      const isDisabled = cell.disabled;

                      return (
                        <button
                          key={`day-${cell.day}`}
                          disabled={isDisabled}
                          onClick={() => setSelectedDate(cell.day)}
                          className={`calendar-day font-mono ${
                            isSelected ? "selected-day" : ""
                          } ${
                            isDisabled 
                              ? "opacity-20 cursor-not-allowed disabled-day" 
                              : "text-white/80"
                          }`}
                        >
                          {cell.day.toString().padStart(2, "0")}
                        </button>
                      );
                    })}
                  </div>

                  {/* Calendar CTA */}
                  <div className="border-t border-white/5 pt-5 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-left w-full sm:w-auto">
                      <span className="font-mono text-[9px] tracking-wider text-[#555566] uppercase block">
                        SELECTED DATE:
                      </span>
                      <span className="font-mono text-xs text-white font-bold tracking-widest">
                        JUNE {selectedDate ? selectedDate.toString().padStart(2, "0") : "—"}, 2026
                      </span>
                    </div>

                    <button
                      disabled={!selectedDate}
                      onClick={handleBookCall}
                      className="w-full sm:w-auto px-6 py-3 bg-[#c5a880] disabled:bg-[#c5a880]/20 disabled:text-white/40 disabled:cursor-not-allowed text-black font-semibold font-outfit text-xs tracking-[0.18em] rounded-sm hover:bg-[#d8be99] hover:shadow-[0_0_15px_rgba(197,168,128,0.25)] transition-all duration-300 cursor-pointer"
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
    </section>
  );
}
