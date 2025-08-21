import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface Feature {
  id: number
  title: string
  description: string
  icon: string
  image: string
}

interface FeaturesSectionProps {
  config: Feature[]
}

export function FeaturesSection({ config }: FeaturesSectionProps) {
  return (
    <section id="features" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create stunning landing pages that convert visitors into customers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {config.map((feature) => (
            <Card key={feature.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Image
                      src={
                        feature.icon ||
                        "/placeholder.svg?height=64&width=64&query=green modern icon for web development"
                      }
                      alt={`${feature.title} icon`}
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>

                <div className="relative">
                  <Image
                    src={
                      feature.image ||
                      "/placeholder.svg?height=300&width=400&query=modern green and white web interface mockup"
                    }
                    alt={`${feature.title} preview`}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
