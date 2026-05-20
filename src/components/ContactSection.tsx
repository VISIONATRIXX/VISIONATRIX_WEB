"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle2, Clock, Paperclip, AlertTriangle } from "lucide-react";
import confetti from "canvas-confetti";

interface FormData {
  fullName: string;
  email: string;
  organization: string;
  service: string;
  details: string;
}

export default function ContactSection() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [budgetTier, setBudgetTier] = useState<string>("$15K - $40K");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [timeStr, setTimeStr] = useState<string>("");

  // Live ticking clocks for India Standard Time (IST)
  useEffect(() => {
    const tick = () => {
      const date = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
      setTimeStr(formatter.format(date));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const budgetTiers = [
    "$5K - $15K",
    "$15K - $40K",
    "$40K - $100K",
    "$100K+"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    
    // Simulate API pipeline delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Success Confetti
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.5 },
        colors: ["#c5a880", "#ffffff", "#8c7353"]
      });

      // Clear states
      reset();
      setFileName(null);

      // Auto-hide success screen
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <section 
      id="contact" 
      className="snap-section flex flex-col justify-between bg-[#050507] py-20 px-6 md:px-12 lg:px-24"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-[15%] bottom-[5%] w-[40vw] h-[40vw] bg-[#c5a880]/2 opacity-[0.03] blur-[150px] rounded-full" />
      </div>

      {/* Spacer */}
      <div className="h-10" />

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto">
        
        {/* Left Side: Header & Intro */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="flex flex-col gap-2">
            <span className="font-sans text-[10px] tracking-[0.25em] text-[#c5a880] uppercase">
              [ DOSSIER INGESTION ]
            </span>
            <h2 className="font-display text-3xl font-bold tracking-[0.1em] text-white uppercase">
              INITIALIZE PROPOSAL
            </h2>
          </div>
          <p className="font-sans text-xs sm:text-sm text-[#9999aa] leading-relaxed max-w-sm">
            Please compile your project specifications into our ingestion ledger. We review all entries within a single rotation block (24 hours).
          </p>
        </div>

        {/* Right Side: Form Panel */}
        <div className="lg:col-span-8 w-full">
          <div className="glass-card rounded-md p-6 md:p-8 border border-white/5 relative min-h-[460px] flex flex-col justify-center">
            
            <AnimatePresence mode="wait">
              {submitSuccess ? (
                <motion.div 
                  className="flex flex-col items-center justify-center text-center py-16"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-[#c5a880] mb-5 drop-shadow-[0_0_15px_rgba(197,168,128,0.2)] animate-bounce" />
                  <h3 className="font-display text-lg font-bold tracking-[0.15em] text-white mb-2 uppercase">
                    PROPOSAL INGESTED
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#9999aa] max-w-sm leading-relaxed">
                    Dossier safely logged and type-verified. Our studio architects have been notified. A secure response packet will be delivered shortly.
                  </p>
                </motion.div>
              ) : (
                <motion.form 
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Left Column Fields */}
                  <div className="flex flex-col gap-4">
                    {/* Full Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[10px] tracking-wider text-[#555566] uppercase">FULL NAME *</label>
                      <input 
                        type="text" 
                        placeholder="Your Full Name..."
                        {...register("fullName", { required: true })}
                        className="bg-white/2 border border-white/10 rounded px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#c5a880] transition-colors duration-300 w-full"
                      />
                      {errors.fullName && <span className="text-red-400 font-mono text-[9px] tracking-wider mt-0.5">// Full name required</span>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[10px] tracking-wider text-[#555566] uppercase">CORPORATE EMAIL *</label>
                      <input 
                        type="email" 
                        placeholder="Corporate Email..."
                        {...register("email", { 
                          required: true,
                          pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                        })}
                        className="bg-white/2 border border-white/10 rounded px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#c5a880] transition-colors duration-300 w-full"
                      />
                      {errors.email && <span className="text-red-400 font-mono text-[9px] tracking-wider mt-0.5">// Valid email required</span>}
                    </div>

                    {/* Organization */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[10px] tracking-wider text-[#555566] uppercase">ORGANIZATION</label>
                      <input 
                        type="text" 
                        placeholder="Organization / Agency..."
                        {...register("organization")}
                        className="bg-white/2 border border-white/10 rounded px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#c5a880] transition-colors duration-300 w-full"
                      />
                    </div>

                    {/* Service Select */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[10px] tracking-wider text-[#555566] uppercase">SERVICE INTERESTED *</label>
                      <select 
                        {...register("service", { required: true })}
                        defaultValue=""
                        className="bg-black/90 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#c5a880] transition-colors duration-300 w-full appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="text-white/20">Select Service...</option>
                        <option value="video">Video Editing</option>
                        <option value="vfx">VFX Simulations</option>
                        <option value="cgi">CGI Advertising</option>
                        <option value="env">Environment Creation</option>
                        <option value="web">WebGL Web Code</option>
                        <option value="app">App Architectures</option>
                        <option value="ai">AI Production Shoots</option>
                        <option value="xr">VR & Spatial XR</option>
                      </select>
                      {errors.service && <span className="text-red-400 font-mono text-[9px] tracking-wider mt-0.5">// Please select a service</span>}
                    </div>
                  </div>

                  {/* Right Column Fields */}
                  <div className="flex flex-col gap-4">
                    {/* Budget Tiers */}
                    <div className="flex flex-col gap-2">
                      <label className="font-sans text-[10px] tracking-wider text-[#555566] uppercase">ESTIMATED BUDGET</label>
                      <div className="grid grid-cols-2 gap-2">
                        {budgetTiers.map((tier) => (
                          <button
                            key={tier}
                            type="button"
                            onClick={() => setBudgetTier(tier)}
                            className={`py-2.5 rounded border transition-all duration-300 font-mono text-[10px] tracking-wider cursor-pointer ${
                              budgetTier === tier
                                ? "bg-[#c5a880] text-black border-[#c5a880] font-semibold"
                                : "bg-white/2 border-white/5 text-white/70 hover:border-white/15"
                            }`}
                          >
                            [ {tier} ]
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* File Attachment */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[10px] tracking-wider text-[#555566] uppercase">CONCEPT BRIEF / BRIEFING</label>
                      <div className="border border-dashed border-white/10 hover:border-[#c5a880]/40 bg-white/2 rounded p-3 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative">
                        <input 
                          type="file" 
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          aria-label="Upload concept brief"
                        />
                        <Upload className="w-5 h-5 text-[#c5a880]/70" />
                        <span className="font-sans text-[9px] tracking-wider text-[#9999aa] uppercase">
                          {fileName ? "FILE STAGED" : "ATTACH BRIEF (OPTIONAL)"}
                        </span>
                        {fileName && (
                          <span className="font-mono text-[9px] text-[#c5a880] tracking-wide max-w-[200px] truncate flex items-center gap-1">
                            <Paperclip className="w-3 h-3 shrink-0" />
                            {fileName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Technical details textarea */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-[10px] tracking-wider text-[#555566] uppercase">DOSSIER SPECIFICATIONS *</label>
                      <textarea 
                        rows={3}
                        placeholder="Dossier Details & Technical Scope Specifications..."
                        {...register("details", { required: true })}
                        className="bg-white/2 border border-white/10 rounded px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#c5a880] transition-colors duration-300 resize-none w-full"
                      />
                      {errors.details && <span className="text-red-400 font-mono text-[9px] tracking-wider mt-0.5">// Ingestion specifications required</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-[#c5a880] disabled:bg-[#c5a880]/30 disabled:text-black/40 disabled:cursor-not-allowed text-black font-semibold font-sans text-xs tracking-[0.2em] rounded-sm hover:bg-[#d8be99] hover:shadow-[0_0_15px_rgba(197,168,128,0.2)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{isSubmitting ? "INGESTING DOSSIER..." : "INITIALIZE TICKET PROPOSAL"}</span>
                      {!isSubmitting && <span>→</span>}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Clocks Registry Footer */}
      <div className="w-full border-t border-white/5 pt-6 mt-12 flex justify-center text-center z-10">
        <div className="font-mono text-[10px] text-[#555566] tracking-[0.18em] uppercase flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
          <span>CLOCKS: </span>
          <span className="text-white/80 font-medium">BENGALURU: {timeStr || "00:00:00"}</span>
          <span> // </span>
          <span className="text-white/80 font-medium">MUMBAI: {timeStr || "00:00:00"}</span>
          <span> // </span>
          <span className="text-white/80 font-medium">DELHI: {timeStr || "00:00:00"}</span>
        </div>
      </div>

    </section>
  );
}
