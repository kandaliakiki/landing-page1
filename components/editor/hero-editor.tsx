"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "./image-upload"

interface HeroConfig {
  headline: string
  subheadline: string
  ctaText: string
  ctaSecondary: string
  backgroundImage: string
  heroImage: string
}

interface HeroEditorProps {
  config: HeroConfig
  onChange: (config: HeroConfig) => void
}

export function HeroEditor({ config, onChange }: HeroEditorProps) {
  const updateField = (field: keyof HeroConfig, value: string) => {
    onChange({
      ...config,
      [field]: value,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              value={config.headline}
              onChange={(e) => updateField("headline", e.target.value)}
              placeholder="Enter your main headline"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subheadline">Subheadline</Label>
            <Textarea
              id="subheadline"
              value={config.subheadline}
              onChange={(e) => updateField("subheadline", e.target.value)}
              placeholder="Enter your subheadline"
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ctaText">Primary CTA</Label>
              <Input
                id="ctaText"
                value={config.ctaText}
                onChange={(e) => updateField("ctaText", e.target.value)}
                placeholder="Get Started"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaSecondary">Secondary CTA</Label>
              <Input
                id="ctaSecondary"
                value={config.ctaSecondary}
                onChange={(e) => updateField("ctaSecondary", e.target.value)}
                placeholder="Learn More"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Hero Image</Label>
            <ImageUpload
              value={config.heroImage}
              onChange={(value) => updateField("heroImage", value)}
              placeholder="Upload hero image or enter URL"
            />
          </div>

          <div className="space-y-2">
            <Label>Background Image</Label>
            <ImageUpload
              value={config.backgroundImage}
              onChange={(value) => updateField("backgroundImage", value)}
              placeholder="Upload background image or enter URL"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
