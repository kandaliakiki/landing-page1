"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useEffect } from "react"

interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
}

interface ThemeEditorProps {
  config: ThemeConfig
  onChange: (config: ThemeConfig) => void
}

export function ThemeEditor({ config, onChange }: ThemeEditorProps) {
  const updateColor = (field: keyof ThemeConfig, value: string) => {
    onChange({
      ...config,
      [field]: value,
    })
  }

  const resetToDefaults = () => {
    onChange({
      primaryColor: "#059669",
      secondaryColor: "#10b981",
      accentColor: "#d97706",
      backgroundColor: "#ffffff",
      textColor: "#475569",
    })
  }

  // Apply theme colors to CSS variables for live preview
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty("--color-primary", config.primaryColor)
    root.style.setProperty("--color-secondary", config.secondaryColor)
    root.style.setProperty("--color-accent", config.accentColor)
  }, [config])

  const presetThemes = [
    {
      name: "Ocean Blue",
      colors: {
        primaryColor: "#0ea5e9",
        secondaryColor: "#38bdf8",
        accentColor: "#f59e0b",
        backgroundColor: "#ffffff",
        textColor: "#475569",
      },
    },
    {
      name: "Forest Green",
      colors: {
        primaryColor: "#059669",
        secondaryColor: "#10b981",
        accentColor: "#d97706",
        backgroundColor: "#ffffff",
        textColor: "#475569",
      },
    },
    {
      name: "Royal Purple",
      colors: {
        primaryColor: "#7c3aed",
        secondaryColor: "#a855f7",
        accentColor: "#f59e0b",
        backgroundColor: "#ffffff",
        textColor: "#475569",
      },
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Color Scheme</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            className="flex items-center gap-2 bg-transparent"
          >
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => updateColor("primaryColor", e.target.value)}
                    className="w-16 h-10 p-1 border rounded cursor-pointer"
                  />
                  <Input
                    value={config.primaryColor}
                    onChange={(e) => updateColor("primaryColor", e.target.value)}
                    placeholder="#059669"
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => updateColor("secondaryColor", e.target.value)}
                    className="w-16 h-10 p-1 border rounded cursor-pointer"
                  />
                  <Input
                    value={config.secondaryColor}
                    onChange={(e) => updateColor("secondaryColor", e.target.value)}
                    placeholder="#10b981"
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={config.accentColor}
                    onChange={(e) => updateColor("accentColor", e.target.value)}
                    className="w-16 h-10 p-1 border rounded cursor-pointer"
                  />
                  <Input
                    value={config.accentColor}
                    onChange={(e) => updateColor("accentColor", e.target.value)}
                    placeholder="#d97706"
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={config.backgroundColor}
                    onChange={(e) => updateColor("backgroundColor", e.target.value)}
                    className="w-16 h-10 p-1 border rounded cursor-pointer"
                  />
                  <Input
                    value={config.backgroundColor}
                    onChange={(e) => updateColor("backgroundColor", e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={config.textColor}
                    onChange={(e) => updateColor("textColor", e.target.value)}
                    className="w-16 h-10 p-1 border rounded cursor-pointer"
                  />
                  <Input
                    value={config.textColor}
                    onChange={(e) => updateColor("textColor", e.target.value)}
                    placeholder="#475569"
                    className="flex-1 font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t space-y-4">
            <h4 className="font-medium">Color Preview</h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded border shadow-sm" style={{ backgroundColor: config.primaryColor }} />
                <span className="text-sm">Primary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded border shadow-sm" style={{ backgroundColor: config.secondaryColor }} />
                <span className="text-sm">Secondary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded border shadow-sm" style={{ backgroundColor: config.accentColor }} />
                <span className="text-sm">Accent</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preset Themes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            {presetThemes.map((theme) => (
              <Button
                key={theme.name}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2 bg-transparent"
                onClick={() => onChange(theme.colors)}
              >
                <span className="font-medium text-sm">{theme.name}</span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 rounded-sm border" style={{ backgroundColor: theme.colors.primaryColor }} />
                  <div className="w-4 h-4 rounded-sm border" style={{ backgroundColor: theme.colors.secondaryColor }} />
                  <div className="w-4 h-4 rounded-sm border" style={{ backgroundColor: theme.colors.accentColor }} />
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
