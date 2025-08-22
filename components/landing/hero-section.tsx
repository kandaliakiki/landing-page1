import { Button } from "@/components/ui/button";

interface HeroConfig {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaSecondary: string;
  ctaPrimaryHref?: string;
  ctaSecondaryHref?: string;
  backgroundImage: string;
  heroImage: string;
}

interface HeroSectionProps {
  config: HeroConfig;
}

export function HeroSection({ config }: HeroSectionProps) {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background image */}
      {config.backgroundImage && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${config.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground">
                {config.headline}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                {config.subheadline}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href={config.ctaPrimaryHref || "#pricing"}>
                <Button size="lg" className="text-lg px-8 py-6">
                  {config.ctaText}
                </Button>
              </a>
              <a href={config.ctaSecondaryHref || "#"}>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 bg-transparent"
                >
                  {config.ctaSecondary}
                </Button>
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img
                src={config.heroImage || "/placeholder.svg"}
                alt="Hero illustration"
                width={500}
                height={400}
                className="w-full h-auto rounded-lg shadow-2xl"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=400&width=600";
                }}
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
