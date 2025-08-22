"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SectionsCopy {
  features: { title: string; subtitle: string };
  pricing: { title: string; subtitle: string; mostPopularLabel: string };
  testimonials: { title: string; subtitle: string };
}

export function CopyEditor({
  config,
  onChange,
}: {
  config: SectionsCopy;
  onChange: (c: SectionsCopy) => void;
}) {
  const update = (
    section: keyof SectionsCopy,
    field: string,
    value: string
  ) => {
    onChange({
      ...config,
      [section]: {
        ...(config as any)[section],
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="font-semibold">Features</h3>
        <Label>Title</Label>
        <Input
          value={config.features.title}
          onChange={(e) => update("features", "title", e.target.value)}
        />
        <Label>Subtitle</Label>
        <Input
          value={config.features.subtitle}
          onChange={(e) => update("features", "subtitle", e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Pricing</h3>
        <Label>Title</Label>
        <Input
          value={config.pricing.title}
          onChange={(e) => update("pricing", "title", e.target.value)}
        />
        <Label>Subtitle</Label>
        <Input
          value={config.pricing.subtitle}
          onChange={(e) => update("pricing", "subtitle", e.target.value)}
        />
        <Label>Most Popular Label</Label>
        <Input
          value={config.pricing.mostPopularLabel}
          onChange={(e) =>
            update("pricing", "mostPopularLabel", e.target.value)
          }
        />
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Testimonials</h3>
        <Label>Title</Label>
        <Input
          value={config.testimonials.title}
          onChange={(e) => update("testimonials", "title", e.target.value)}
        />
        <Label>Subtitle</Label>
        <Input
          value={config.testimonials.subtitle}
          onChange={(e) => update("testimonials", "subtitle", e.target.value)}
        />
      </div>
    </div>
  );
}
