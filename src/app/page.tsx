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
import type Lenis from "lenis";

// Declare global or other type definitions if needed here

// Load Three.js 3D backdrop client-side only
const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

// Load CustomCursor client-side only
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [startAnimations, setStartAnimations] = useState(false);
  const [triggerHeroEntrance, setTriggerHeroEntrance] = useState(false);
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
    let lenisInstance: Lenis | null = null;
    let rafId: number;
    let isDestroyed = false;
    
    import("lenis").then(({ default: LenisClass }) => {
      if (isDestroyed) return; // Guard against race condition if component unmounts during import
      
      lenisInstance = new LenisClass({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        wheelMultiplier: 1,
      });

      // Synchronize ScrollTrigger with Lenis scroll events
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        if (!isDestroyed && lenisInstance) {
          lenisInstance.on("scroll", ScrollTrigger.update);
        }
      });

      const raf = (time: number) => {
        if (isDestroyed || !lenisInstance) return;
        lenisInstance.raf(time);
        rafId = requestAnimationFrame(raf);
      };

      rafId = requestAnimationFrame(raf);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).lenis = lenisInstance;
    });

    return () => {
      isDestroyed = true;
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (lenisInstance) {
        lenisInstance.destroy();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).lenis === lenisInstance) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (window as any).lenis;
      }
    };
  }, [showIntro]);

  // Trigger ScrollTrigger refresh once the intro screen is dismissed to calculate correct page heights
  useEffect(() => {
    if (!showIntro) {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 300);
      });
    }
  }, [showIntro]);

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lenis = (window as any).lenis;
      if (lenis && typeof lenis.scrollTo === "function") {
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
      <CustomCursor />
      {/* Intro Loader screen overlay */}
      {showIntro && (
        <IntroLoader 
          onStartDismiss={() => {
            setStartAnimations(true);
            setTimeout(() => {
              setTriggerHeroEntrance(true);
            }, 1200);
          }}
          onComplete={() => {
            setShowIntro(false);
            setStartAnimations(true);
            setTriggerHeroEntrance(true);
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
            <HeroSection onCtaClick={scrollToSection} triggerEntrance={triggerHeroEntrance} />

            {/* 2. Studio Section */}
            <StudioSection />

            {/* 3. Services Section */}
            <ServicesSection 
              onInquiryClick={() => scrollToSection("contact")} 
              isIntroCompleted={!showIntro}
            />

            {/* 4. Works Section */}
            <WorksSection />

            {/* 5. Process: Timeline Section */}
            <ProcessSection />

            {/* 6. Process: Engine Stack Section */}
            <EngineStackSection />

            {/* 7. Process: Client Feedback Section */}
            <FeedbackSection />

            {/* 8. FAQ & Booking Calendar Section */}
            <FAQSection />

            {/* 9. Contact Dossier & Footer Section */}
            <div className="relative w-full">
              <ContactSection />
              <Footer onLinkClick={scrollToSection} />
            </div>
          </main>
        )}
      </div>
    </>
  );
}
