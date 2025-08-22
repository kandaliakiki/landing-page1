"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, X } from "lucide-react";

interface PricingTier {
  id: number;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  ctaText: string;
  ctaHref?: string;
}

interface PricingEditorProps {
  config: PricingTier[];
  onChange: (config: PricingTier[]) => void;
}

export function PricingEditor({ config, onChange }: PricingEditorProps) {
  const addTier = () => {
    const newTier: PricingTier = {
      id: Math.max(...config.map((t) => t.id), 0) + 1,
      name: "New Plan",
      price: "$19",
      period: "month",
      description: "Plan description",
      features: ["Feature 1", "Feature 2"],
      popular: false,
      ctaText: "Get Started",
    };
    onChange([...config, newTier]);
  };

  const updateTier = (id: number, field: keyof PricingTier, value: any) => {
    onChange(
      config.map((tier) =>
        tier.id === id ? { ...tier, [field]: value } : tier
      )
    );
  };

  const removeTier = (id: number) => {
    onChange(config.filter((tier) => tier.id !== id));
  };

  const addFeature = (tierId: number) => {
    const tier = config.find((t) => t.id === tierId);
    if (tier) {
      updateTier(tierId, "features", [...tier.features, "New Feature"]);
    }
  };

  const updateFeature = (
    tierId: number,
    featureIndex: number,
    value: string
  ) => {
    const tier = config.find((t) => t.id === tierId);
    if (tier) {
      const newFeatures = [...tier.features];
      newFeatures[featureIndex] = value;
      updateTier(tierId, "features", newFeatures);
    }
  };

  const removeFeature = (tierId: number, featureIndex: number) => {
    const tier = config.find((t) => t.id === tierId);
    if (tier) {
      const newFeatures = tier.features.filter(
        (_, index) => index !== featureIndex
      );
      updateTier(tierId, "features", newFeatures);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Pricing Tiers ({config.length})</h3>
        <Button onClick={addTier} size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Tier
        </Button>
      </div>

      <div className="space-y-6">
        {config.map((tier) => (
          <Card key={tier.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base">{tier.name}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTier(tier.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Plan Name</Label>
                    <Input
                      value={tier.name}
                      onChange={(e) =>
                        updateTier(tier.id, "name", e.target.value)
                      }
                      placeholder="Plan name"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input
                        value={tier.price}
                        onChange={(e) =>
                          updateTier(tier.id, "price", e.target.value)
                        }
                        placeholder="$19"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Period</Label>
                      <Input
                        value={tier.period}
                        onChange={(e) =>
                          updateTier(tier.id, "period", e.target.value)
                        }
                        placeholder="month"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={tier.description}
                      onChange={(e) =>
                        updateTier(tier.id, "description", e.target.value)
                      }
                      placeholder="Plan description"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>CTA Text</Label>
                    <Input
                      value={tier.ctaText}
                      onChange={(e) =>
                        updateTier(tier.id, "ctaText", e.target.value)
                      }
                      placeholder="Get Started"
                    />
                    <Input
                      value={tier.ctaHref || ""}
                      onChange={(e) =>
                        updateTier(tier.id, "ctaHref", e.target.value)
                      }
                      placeholder="#section or https://..."
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`popular-${tier.id}`}
                      checked={tier.popular}
                      onCheckedChange={(checked) =>
                        updateTier(tier.id, "popular", checked)
                      }
                    />
                    <Label htmlFor={`popular-${tier.id}`}>
                      Mark as popular
                    </Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Features</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addFeature(tier.id)}
                      className="flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          value={feature}
                          onChange={(e) =>
                            updateFeature(tier.id, index, e.target.value)
                          }
                          placeholder="Feature name"
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(tier.id, index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
