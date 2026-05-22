"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, CheckCircle2, Clock, Paperclip, AlertTriangle } from "lucide-react";
import confetti from "canvas-confetti";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollAnimatedWrapper from "./ScrollAnimatedWrapper";

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
  const [fileError, setFileError] = useState<string | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Magnetic button hover and scroll text scaling
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const button = buttonRef.current;
    if (button) {
      let rect: DOMRect | null = null;

      const updateRect = () => {
        rect = button.getBoundingClientRect();
      };

      // Measure once on init
      updateRect();

      const handleMouseMove = (e: MouseEvent) => {
        if (!rect) return;
        const btnX = rect.left + rect.width / 2;
        const btnY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        const distanceX = mouseX - btnX;
        const distanceY = mouseY - btnY;
        const distance = Math.hypot(distanceX, distanceY);
        
        const threshold = 100; // Trigger distance in pixels
        
        if (distance < threshold) {
          const power = (threshold - distance) / threshold;
          const x = distanceX * 0.35 * power;
          const y = distanceY * 0.35 * power;
          
          gsap.to(button, {
            x: x,
            y: y,
            duration: 0.3,
            ease: "power2.out",
          });
        } else {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
          });
        }
      };

      const handleMouseLeave = () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      window.addEventListener("scroll", updateRect, { passive: true });
      window.addEventListener("resize", updateRect, { passive: true });
      button.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("scroll", updateRect);
        window.removeEventListener("resize", updateRect);
        button.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [submitSuccess]);

  // Scroll Trigger to scale the heading text
  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);
    const titleEl = titleRef.current;
    
    if (titleEl) {
      const scrollTween = gsap.fromTo(titleEl, 
        { scale: 0.9, opacity: 0.7 },
        { 
          scale: 1.1, 
          opacity: 1, 
          ease: "none",
          scrollTrigger: {
            trigger: titleEl,
            start: "top bottom-=100px",
            end: "bottom center",
            scrub: true,
          }
        }
      );

      return () => {
        if (scrollTween.scrollTrigger) scrollTween.scrollTrigger.kill();
        scrollTween.kill();
      };
    }
  }, []);

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
    setFileError(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedExtensions = /(\.pdf|\.zip|\.doc|\.docx|\.txt|\.png|\.jpg|\.jpeg)$/i;
      
      // 1. File Size Verification (Max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setFileError("// File size exceeds 10MB limit");
        setFileName(null);
        e.target.value = ""; // Clear input
        return;
      }
      
      // 2. File Format / Extension Verification
      if (!allowedExtensions.exec(file.name)) {
        setFileError("// Forbidden file format staged");
        setFileName(null);
        e.target.value = ""; // Clear input
        return;
      }
      
      setFileName(file.name);
    }
  };

  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    
    // Construct formatted text message summary
    const textMessage = `Hello Visionatrix Studio!

A new Project Proposal has been submitted:
- Name: ${data.fullName}
- Email: ${data.email}
- Organization: ${data.organization || 'N/A'}
- Selected Service: ${data.service}
- Estimated Budget: ${budgetTier}
- Ingestion Details: ${data.details}
- Staged Concept Brief: ${fileName || 'None'}`;

    // WhatsApp Integration (wa.me)
    const encodedMsg = encodeURIComponent(textMessage);
    const whatsappUrl = `https://wa.me/919727905010?text=${encodedMsg}`;

    // Email Integration (mailto)
    const mailtoUrl = `mailto:visionatrixx@gmail.com?subject=${encodeURIComponent("New Project Proposal - " + data.fullName)}&body=${encodedMsg}`;

    // Trigger WhatsApp instantly in a new tab (satisfies direct click event stream bypass for pop-up blocker)
    try {
      window.open(whatsappUrl, "_blank");
    } catch (e) {
      console.error("Popup blocked:", e);
    }

    // Trigger Email client redirection
    window.location.assign(mailtoUrl);

    // Simulate API pipeline delay and set success
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
      className="snap-section flex flex-col justify-between bg-[#0b0b0f] py-20 px-6 md:px-12 lg:px-24"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-[15%] bottom-[5%] w-[40vw] h-[40vw] bg-[#c5a880]/2 opacity-[0.03] blur-[150px] rounded-full" />
      </div>

      {/* Spacer */}
      <div className="h-10" />

      {/* Animated Wrapper for scroll parallax */}
      <ScrollAnimatedWrapper className="flex flex-col justify-between my-auto w-full z-10">
        {/* Main Grid Content */}
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Header & Intro */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#c5a880] uppercase">
              [ DOSSIER INGESTION ]
            </span>
            <h2 ref={titleRef} className="font-display text-3xl font-bold tracking-[0.1em] text-white uppercase origin-left">
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
                  <h3 className="font-outfit text-lg font-bold tracking-[0.15em] text-white mb-2 uppercase">
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
                      <label className="font-mono text-[10px] tracking-wider text-[#555566] uppercase">FULL NAME *</label>
                      <input 
                        type="text" 
                        placeholder="Your Full Name..."
                        {...register("fullName", { required: true })}
                        className="font-sans bg-white/2 border border-white/10 rounded px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#c5a880] transition-colors duration-300 w-full"
                      />
                      {errors.fullName && <span className="text-red-400 font-mono text-[9px] tracking-wider mt-0.5">{"// Full name required"}</span>}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] tracking-wider text-[#555566] uppercase">CORPORATE EMAIL *</label>
                      <input 
                        type="email" 
                        placeholder="Corporate Email..."
                        {...register("email", { 
                          required: true,
                          pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                        })}
                        className="font-sans bg-white/2 border border-white/10 rounded px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#c5a880] transition-colors duration-300 w-full"
                      />
                      {errors.email && <span className="text-red-400 font-mono text-[9px] tracking-wider mt-0.5">{"// Valid email required"}</span>}
                    </div>

                    {/* Organization */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] tracking-wider text-[#555566] uppercase">ORGANIZATION</label>
                      <input 
                        type="text" 
                        placeholder="Organization / Agency..."
                        {...register("organization")}
                        className="font-sans bg-white/2 border border-white/10 rounded px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#c5a880] transition-colors duration-300 w-full"
                      />
                    </div>

                    {/* Service Select */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] tracking-wider text-[#555566] uppercase">SERVICE INTERESTED *</label>
                      <select 
                        {...register("service", { required: true })}
                        defaultValue=""
                        className="font-sans bg-[#0b0b0f]/95 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-[#c5a880] transition-colors duration-300 w-full appearance-none cursor-pointer"
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
                      {errors.service && <span className="text-red-400 font-mono text-[9px] tracking-wider mt-0.5">{"// Please select a service"}</span>}
                    </div>
                  </div>

                  {/* Right Column Fields */}
                  <div className="flex flex-col gap-4">
                    {/* Budget Tiers */}
                    <div className="flex flex-col gap-2">
                      <label className="font-mono text-[10px] tracking-wider text-[#555566] uppercase">ESTIMATED BUDGET</label>
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
                      <label className="font-mono text-[10px] tracking-wider text-[#555566] uppercase">CONCEPT BRIEF / BRIEFING</label>
                      <div className="border border-dashed border-white/10 hover:border-[#c5a880]/40 bg-white/2 rounded p-3 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative">
                        <input 
                          type="file" 
                          onChange={handleFileChange}
                          accept=".pdf,.zip,.doc,.docx,.txt,.png,.jpg,.jpeg"
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          aria-label="Upload concept brief"
                        />
                        <Upload className="w-5 h-5 text-[#c5a880]/70" />
                        <span className="font-mono text-[9px] tracking-wider text-[#9999aa] uppercase">
                          {fileName ? "FILE STAGED" : "ATTACH BRIEF (OPTIONAL)"}
                        </span>
                        {fileName && (
                          <span className="font-mono text-[9px] text-[#c5a880] tracking-wide max-w-[200px] truncate flex items-center gap-1">
                            <Paperclip className="w-3 h-3 shrink-0" />
                            {fileName}
                          </span>
                        )}
                        {fileError && (
                          <span className="font-mono text-[9px] text-[#c5a880] tracking-wide mt-1 flex items-center gap-1 text-center justify-center">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            {fileError}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Technical details textarea */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] tracking-wider text-[#555566] uppercase">DOSSIER SPECIFICATIONS *</label>
                      <textarea 
                        rows={3}
                        placeholder="Dossier Details & Technical Scope Specifications..."
                        {...register("details", { required: true })}
                        className="font-sans bg-white/2 border border-white/10 rounded px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#c5a880] transition-colors duration-300 resize-none w-full"
                      />
                      {errors.details && <span className="text-red-400 font-mono text-[9px] tracking-wider mt-0.5">{"// Ingestion specifications required"}</span>}
                    </div>

                    {/* Submit Button */}
                    <button
                      ref={buttonRef}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-[#c5a880] disabled:bg-[#c5a880]/30 disabled:text-black/40 disabled:cursor-not-allowed text-black font-semibold font-outfit text-xs tracking-[0.2em] rounded-sm hover:bg-[#d8be99] hover:shadow-[0_0_15px_rgba(197,168,128,0.2)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
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
        <div className="w-full border-t border-white/5 pt-6 mt-12 flex justify-center text-center">
          <div className="font-mono text-[10px] text-[#555566] tracking-[0.18em] uppercase flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>CLOCKS: </span>
            <span className="text-white/80 font-medium">BENGALURU: {timeStr || "00:00:00"}</span>
            <span> {"//"} </span>
            <span className="text-white/80 font-medium">MUMBAI: {timeStr || "00:00:00"}</span>
            <span> {"//"} </span>
            <span className="text-white/80 font-medium">DELHI: {timeStr || "00:00:00"}</span>
          </div>
        </div>
      </ScrollAnimatedWrapper>

    </section>
  );
}
