"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { ImageUpload } from "./image-upload"

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  avatar: string
  rating: number
}

interface TestimonialsEditorProps {
  config: Testimonial[]
  onChange: (config: Testimonial[]) => void
}

export function TestimonialsEditor({ config, onChange }: TestimonialsEditorProps) {
  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Math.max(...config.map((t) => t.id), 0) + 1,
      name: "Customer Name",
      role: "Job Title",
      company: "Company Name",
      content: "This is an amazing product that has transformed our business.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    }
    onChange([...config, newTestimonial])
  }

  const updateTestimonial = (id: number, field: keyof Testimonial, value: string | number) => {
    onChange(config.map((testimonial) => (testimonial.id === id ? { ...testimonial, [field]: value } : testimonial)))
  }

  const removeTestimonial = (id: number) => {
    onChange(config.filter((testimonial) => testimonial.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Testimonials ({config.length})</h3>
        <Button onClick={addTestimonial} size="sm" className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Testimonial
        </Button>
      </div>

      <div className="space-y-4">
        {config.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base">{testimonial.name}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTestimonial(testimonial.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={testimonial.name}
                      onChange={(e) => updateTestimonial(testimonial.id, "name", e.target.value)}
                      placeholder="Customer name"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input
                        value={testimonial.role}
                        onChange={(e) => updateTestimonial(testimonial.id, "role", e.target.value)}
                        placeholder="Job title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        value={testimonial.company}
                        onChange={(e) => updateTestimonial(testimonial.id, "company", e.target.value)}
                        placeholder="Company name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Rating (1-5)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonial.rating}
                      onChange={(e) => updateTestimonial(testimonial.id, "rating", Number.parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Testimonial Content</Label>
                    <Textarea
                      value={testimonial.content}
                      onChange={(e) => updateTestimonial(testimonial.id, "content", e.target.value)}
                      placeholder="Customer testimonial"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Avatar</Label>
                    <ImageUpload
                      value={testimonial.avatar}
                      onChange={(value) => updateTestimonial(testimonial.id, "avatar", value)}
                      placeholder="Upload avatar or enter URL"
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
