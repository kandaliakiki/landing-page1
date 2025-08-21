"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { ImageUpload } from "./image-upload"

interface Feature {
  id: number
  title: string
  description: string
  icon: string
  image: string
}

interface FeaturesEditorProps {
  config: Feature[]
  onChange: (config: Feature[]) => void
}

export function FeaturesEditor({ config, onChange }: FeaturesEditorProps) {
  const addFeature = () => {
    const newFeature: Feature = {
      id: Math.max(...config.map((f) => f.id), 0) + 1,
      title: "New Feature",
      description: "Feature description",
      icon: "/placeholder.svg?height=64&width=64",
      image: "/placeholder.svg?height=300&width=400",
    }
    onChange([...config, newFeature])
  }

  const updateFeature = (id: number, field: keyof Feature, value: string | number) => {
    onChange(config.map((feature) => (feature.id === id ? { ...feature, [field]: value } : feature)))
  }

  const removeFeature = (id: number) => {
    onChange(config.filter((feature) => feature.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Features ({config.length})</h3>
        <Button onClick={addFeature} size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Feature
        </Button>
      </div>

      <div className="space-y-4">
        {config.map((feature) => (
          <Card key={feature.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base">Feature {feature.id}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFeature(feature.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={feature.title}
                      onChange={(e) => updateFeature(feature.id, "title", e.target.value)}
                      placeholder="Feature title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => updateFeature(feature.id, "description", e.target.value)}
                      placeholder="Feature description"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <ImageUpload
                      value={feature.icon}
                      onChange={(value) => updateFeature(feature.id, "icon", value)}
                      placeholder="Upload icon or enter URL"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Image</Label>
                    <ImageUpload
                      value={feature.image}
                      onChange={(value) => updateFeature(feature.id, "image", value)}
                      placeholder="Upload image or enter URL"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
