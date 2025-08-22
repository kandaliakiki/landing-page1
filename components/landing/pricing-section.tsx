import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { landingConfig } from "@/lib/landingConfig";

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

interface PricingSectionProps {
  config: PricingTier[];
  copy: { title: string; subtitle: string; mostPopularLabel: string };
}

export function PricingSection({ config, copy }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">
            {copy.title}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {copy.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {config.map((tier) => (
            <Card
              key={tier.id}
              className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
                tier.popular
                  ? "border-primary shadow-lg sm:scale-105"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                  {copy.mostPopularLabel}
                </Badge>
              )}

              <CardHeader className="text-center space-y-4 pb-8">
                <h3 className="text-2xl font-bold">{tier.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">
                      /{tier.period}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={tier.ctaHref || "#pricing"}
                  className="block"
                  target={
                    tier.ctaHref && tier.ctaHref.startsWith("http")
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    tier.ctaHref && tier.ctaHref.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  <Button
                    className="w-full"
                    variant={tier.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {tier.ctaText}
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
