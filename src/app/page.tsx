"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
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

// Load Three.js 3D backdrop client-side only
const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [startAnimations, setStartAnimations] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Track scroll position to update active dot navigation via window observer
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

    const observerOptions = {
      root: null, // Track viewport scroll
      rootMargin: "-40% 0px -40% 0px", // Trigger when section is in the center of viewport
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

  // Lenis smooth scroll initialization
  useEffect(() => {
    if (showIntro) return;

    // Dynamically load Lenis to avoid Server-Side Rendering issues
    let lenisInstance: any;
    
    import("lenis").then(({ default: Lenis }) => {
      lenisInstance = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
      });

      // Synchronize ScrollTrigger with Lenis scroll events
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        lenisInstance.on("scroll", ScrollTrigger.update);
      });

      const raf = (time: number) => {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      };

      requestAnimationFrame(raf);
      (window as any).lenis = lenisInstance;
    });

    return () => {
      if (lenisInstance) {
        lenisInstance.destroy();
      }
    };
  }, [showIntro]);

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.scrollTo(target, {
          duration: 1.6,
          offset: 0,
          lock: false,
        });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
      setActiveSection(sectionId);
    }
  };

  return (
    <>
      {/* Intro Loader screen overlay */}
      {showIntro && (
        <IntroLoader 
          onStartDismiss={() => setStartAnimations(true)}
          onComplete={() => {
            setShowIntro(false);
            setStartAnimations(true);
          }}
        />
      )}

      {/* Main layout */}
      <div className="relative w-full min-h-screen bg-[#050507] overflow-x-hidden">
        {/* Persistent 3D WebGL background */}
        {startAnimations && <Scene3D />}

        {/* Header Sticky Navigation */}
        {!showIntro && (
          <Header activeSection={activeSection} onNavClick={scrollToSection} />
        )}

        {/* Right vertical dot indicators */}
        {!showIntro && (
          <ScrollNavigation activeSection={activeSection} onDotClick={scrollToSection} />
        )}

        {/* Core Sections Container */}
        {startAnimations && (
          <main className={`snap-container ${showIntro ? "pointer-events-none h-screen overflow-hidden" : "w-full"}`}>
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
        )}
      </div>
    </>
  );
}
