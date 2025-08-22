"use client";

import { useState, useEffect } from "react";
import { landingConfig as defaultConfig } from "@/lib/landingConfig";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FooterSection } from "@/components/landing/footer-section";
import { Header } from "@/components/landing/header";

export default function LandingPage() {
  const [config, setConfig] = useState(defaultConfig);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const mergeWithDefaults = (incoming: any) => {
    if (!incoming) return defaultConfig as any;
    return {
      ...defaultConfig,
      ...incoming,
      header: {
        ...(defaultConfig as any).header,
        ...(incoming as any).header,
      },
      sections: {
        ...(defaultConfig as any).sections,
        ...((incoming as any).sections || {}),
      },
    };
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const preview = urlParams.get("preview");
    const configParam = urlParams.get("config");

    if (preview === "true") {
      setIsPreviewMode(true);
      if (configParam) {
        try {
          const parsedConfig = JSON.parse(configParam);
          setConfig(mergeWithDefaults(parsedConfig));
        } catch (error) {
          console.log("[v0] Could not parse config from URL:", error);
        }
      }
      // Restore preview config (prefer cross-tab localStorage, fallback to sessionStorage)
      try {
        const storedLocal = localStorage.getItem("landingPreviewConfig");
        const storedSession = sessionStorage.getItem("landingPreviewConfig");
        const stored = storedLocal || storedSession;
        if (stored) {
          const parsed = JSON.parse(stored);
          setConfig(mergeWithDefaults(parsed));
        }
      } catch (err) {
        console.log("[v0] Could not restore preview config:", err);
      }
    } else {
      // Outside preview mode, load last saved config
      try {
        const saved = localStorage.getItem("landingSavedConfig");
        if (saved) {
          const parsedSaved = JSON.parse(saved);
          setConfig(mergeWithDefaults(parsedSaved));
        }
      } catch (err) {
        console.log("[v0] Could not load saved config:", err);
      }
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "CONFIG_UPDATE") {
        setConfig(mergeWithDefaults(event.data.config));
        try {
          localStorage.setItem(
            "landingPreviewConfig",
            JSON.stringify(event.data.config)
          );
        } catch (err) {
          console.log("[v0] Could not persist preview config:", err);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    if (typeof window !== "undefined") {
      (window as any).updateLandingPage = (newConfig: any) => {
        setConfig(mergeWithDefaults(newConfig));
        try {
          localStorage.setItem(
            "landingPreviewConfig",
            JSON.stringify(newConfig)
          );
        } catch (err) {
          console.log("[v0] Could not persist preview config (manual):", err);
        }
      };
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header config={config.header} />
      <main>
        <HeroSection config={config.hero} />
        <FeaturesSection
          config={config.features}
          copy={config.sections.features}
        />
        <PricingSection
          config={config.pricing}
          copy={config.sections.pricing}
        />
        <TestimonialsSection
          config={config.testimonials}
          copy={config.sections.testimonials}
        />
      </main>
      <FooterSection config={config.footer} />
    </div>
  );
}
