"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ScrollNavigation from "@/components/ScrollNavigation";
import IntroLoader from "@/components/IntroLoader";
import HeroSection from "@/components/HeroSection";
import StudioSection from "@/components/StudioSection";
import ServicesSection from "@/components/ServicesSection";
import WorksSection from "@/components/WorksSection";
import ProcessSection from "@/components/ProcessSection";
import EngineStackSection from "@/components/EngineStackSection";
import FeedbackSection from "@/components/FeedbackSection";
import FAQSection from "@/components/FAQSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeSection, setActiveSection] = useState("home");

  // Track scroll position to update active dot navigation
  useEffect(() => {
    if (showIntro) return;

    const sections = [
      "home",
      "studio",
      "services",
      "works",
      "process",
      "engine-stack",
      "feedback",
      "faq",
      "contact",
    ];

    const container = document.querySelector(".snap-container");
    if (!container) return;

    const observerOptions = {
      root: container,
      rootMargin: "-25% 0px -25% 0px", // Trigger when section is in center of viewport
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [showIntro]);

  const scrollToSection = (sectionId: string) => {
    const container = document.querySelector(".snap-container");
    const target = document.getElementById(sectionId);
    
    if (container && target) {
      // Direct scroll container mapping
      container.scrollTo({
        top: target.offsetTop,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <>
      {/* Intro Loader screen overlay */}
      {showIntro && (
        <IntroLoader onComplete={() => setShowIntro(false)} />
      )}

      {/* Main layout (pre-mounted for seamless asset loading and animations) */}
      <div className="relative w-full h-screen bg-[#050507]">
        {/* Header Sticky Navigation */}
        {!showIntro && (
          <Header activeSection={activeSection} onNavClick={scrollToSection} />
        )}

        {/* Right vertical dot indicators */}
        {!showIntro && (
          <ScrollNavigation activeSection={activeSection} onDotClick={scrollToSection} />
        )}

        {/* Core Scroll Snapped Page Sections Container */}
        <main className={`snap-container ${showIntro ? "pointer-events-none overflow-hidden" : ""}`}>
          {/* 1. Home Section */}
          <div id="home" className="snap-section">
            <HeroSection onCtaClick={scrollToSection} />
          </div>

          {/* 2. Studio Section */}
          <div id="studio" className="snap-section">
            <StudioSection />
          </div>

          {/* 3. Services Section */}
          <div id="services" className="snap-section">
            <ServicesSection onInquiryClick={() => scrollToSection("contact")} />
          </div>

          {/* 4. Works Section */}
          <div id="works" className="snap-section">
            <WorksSection />
          </div>

          {/* 5. Process: Timeline Section */}
          <div id="process" className="snap-section">
            <ProcessSection />
          </div>

          {/* 6. Process: Engine Stack Section */}
          <div id="engine-stack" className="snap-section">
            <EngineStackSection />
          </div>

          {/* 7. Process: Client Feedback Section */}
          <div id="feedback" className="snap-section">
            <FeedbackSection />
          </div>

          {/* 8. FAQ & Booking Calendar Section */}
          <div id="faq" className="snap-section">
            <FAQSection />
          </div>

          {/* 9. Contact Dossier & Footer Section */}
          <div id="contact" className="snap-section flex flex-col justify-between overflow-y-auto no-scrollbar">
            <ContactSection />
            <Footer onLinkClick={scrollToSection} />
          </div>
        </main>
      </div>
    </>
  );
}
