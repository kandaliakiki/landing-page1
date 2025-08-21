"use client"

import { useState, useEffect } from "react"
import { landingConfig as defaultConfig } from "@/lib/landingConfig"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { FooterSection } from "@/components/landing/footer-section"
import { Header } from "@/components/landing/header"

export default function LandingPage() {
  const [config, setConfig] = useState(defaultConfig)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const preview = urlParams.get("preview")
    const configParam = urlParams.get("config")

    if (preview === "true") {
      setIsPreviewMode(true)
      if (configParam) {
        try {
          const parsedConfig = JSON.parse(configParam)
          setConfig(parsedConfig)
        } catch (error) {
          console.log("[v0] Could not parse config from URL:", error)
        }
      }
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "CONFIG_UPDATE") {
        setConfig(event.data.config)
      }
    }

    window.addEventListener("message", handleMessage)

    if (typeof window !== "undefined") {
      ;(window as any).updateLandingPage = (newConfig: any) => {
        setConfig(newConfig)
      }
    }

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection config={config.hero} />
        <FeaturesSection config={config.features} />
        <PricingSection config={config.pricing} />
        <TestimonialsSection config={config.testimonials} />
      </main>
      <FooterSection config={config.footer} />
    </div>
  )
}
