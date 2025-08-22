"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
}

export interface HeaderConfig {
  brandName: string;
  brandInitials: string;
  nav: NavItem[];
  ctaLabel: string;
  showEditorLink?: boolean;
}

export function HeaderEditor({
  config,
  onChange,
}: {
  config: HeaderConfig;
  onChange: (c: HeaderConfig) => void;
}) {
  const updateField = (field: keyof HeaderConfig, value: any) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  const addNav = () => {
    updateField("nav", [...config.nav, { name: "New", href: "#" }]);
  };

  const updateNav = (index: number, field: keyof NavItem, value: string) => {
    const next = [...config.nav];
    next[index] = { ...next[index], [field]: value };
    updateField("nav", next);
  };

  const removeNav = (index: number) => {
    updateField(
      "nav",
      config.nav.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Brand Name</Label>
          <Input
            value={config.brandName}
            onChange={(e) => updateField("brandName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Brand Initials</Label>
          <Input
            value={config.brandInitials}
            onChange={(e) => updateField("brandInitials", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>CTA Label</Label>
          <Input
            value={config.ctaLabel}
            onChange={(e) => updateField("ctaLabel", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Navigation</Label>
          <Button
            size="sm"
            variant="outline"
            onClick={addNav}
            className="flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
        <div className="space-y-3">
          {config.nav.map((item, index) => (
            <div
              key={index}
              className="grid gap-2 md:grid-cols-[1fr_1fr_auto] items-center"
            >
              <Input
                value={item.name}
                onChange={(e) => updateNav(index, "name", e.target.value)}
                placeholder="Label"
              />
              <Input
                value={item.href}
                onChange={(e) => updateNav(index, "href", e.target.value)}
                placeholder="/#id"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeNav(index)}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
