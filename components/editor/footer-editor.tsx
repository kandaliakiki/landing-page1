"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface FooterLink {
  name: string
  href: string
}

interface SocialLink {
  name: string
  href: string
  icon: string
}

interface FooterConfig {
  companyName: string
  tagline: string
  description: string
  links: {
    product: FooterLink[]
    company: FooterLink[]
    support: FooterLink[]
  }
  socialLinks: SocialLink[]
}

interface FooterEditorProps {
  config: FooterConfig
  onChange: (config: FooterConfig) => void
}

export function FooterEditor({ config, onChange }: FooterEditorProps) {
  const updateField = (field: keyof FooterConfig, value: any) => {
    onChange({
      ...config,
      [field]: value,
    })
  }

  const updateLinkSection = (section: keyof FooterConfig["links"], links: FooterLink[]) => {
    onChange({
      ...config,
      links: {
        ...config.links,
        [section]: links,
      },
    })
  }

  const addLink = (section: keyof FooterConfig["links"]) => {
    const newLink = { name: "New Link", href: "#" }
    updateLinkSection(section, [...config.links[section], newLink])
  }

  const updateLink = (section: keyof FooterConfig["links"], index: number, field: keyof FooterLink, value: string) => {
    const newLinks = [...config.links[section]]
    newLinks[index] = { ...newLinks[index], [field]: value }
    updateLinkSection(section, newLinks)
  }

  const removeLink = (section: keyof FooterConfig["links"], index: number) => {
    const newLinks = config.links[section].filter((_, i) => i !== index)
    updateLinkSection(section, newLinks)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={config.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                placeholder="Company name"
              />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input
                value={config.tagline}
                onChange={(e) => updateField("tagline", e.target.value)}
                placeholder="Company tagline"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={config.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Company description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {(["product", "company", "support"] as const).map((section) => (
          <Card key={section}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base capitalize">{section} Links</CardTitle>
              <Button variant="outline" size="sm" onClick={() => addLink(section)} className="flex items-center gap-1">
                <Plus className="w-3 h-3" />
                Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {config.links[section].map((link, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      value={link.name}
                      onChange={(e) => updateLink(section, index, "name", e.target.value)}
                      placeholder="Link name"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLink(section, index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    value={link.href}
                    onChange={(e) => updateLink(section, index, "href", e.target.value)}
                    placeholder="Link URL"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
