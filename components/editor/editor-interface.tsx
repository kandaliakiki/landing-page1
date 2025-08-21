"use client"

import { useState, useCallback, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, Save, Monitor, TabletSmartphone, Smartphone, Undo, Redo, Download, EyeOff } from "lucide-react"
import Link from "next/link"
import { landingConfig } from "@/lib/landingConfig"
import { HeroEditor } from "./hero-editor"
import { FeaturesEditor } from "./features-editor"
import { PricingEditor } from "./pricing-editor"
import { TestimonialsEditor } from "./testimonials-editor"
import { FooterEditor } from "./footer-editor"
import { ThemeEditor } from "./theme-editor"
import { LivePreview } from "./live-preview"
import { useUndoRedo } from "@/hooks/use-undo-redo"
import { toast } from "@/hooks/use-toast"

export function EditorInterface() {
  const [config, setConfig] = useState(landingConfig)
  const [activeTab, setActiveTab] = useState("hero")
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [showPreview, setShowPreview] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const { history, currentIndex, pushToHistory, undo, redo, canUndo, canRedo } = useUndoRedo(config)

  const updateConfig = useCallback(
    (section: string, data: any) => {
      const newConfig = {
        ...config,
        [section]: data,
      }
      setConfig(newConfig)
      pushToHistory(newConfig)
      setHasUnsavedChanges(true)
    },
    [config, pushToHistory],
  )

  const handleUndo = () => {
    const previousConfig = undo()
    if (previousConfig) {
      setConfig(previousConfig)
      setHasUnsavedChanges(true)
    }
  }

  const handleRedo = () => {
    const nextConfig = redo()
    if (nextConfig) {
      setConfig(nextConfig)
      setHasUnsavedChanges(true)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setHasUnsavedChanges(false)
      toast({
        title: "Changes saved",
        description: "Your landing page has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was an error saving your changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = () => {
    const dataStr = JSON.stringify(config, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "landing-config.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Config exported",
      description: "Your configuration has been downloaded as JSON.",
    })
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "s":
            e.preventDefault()
            handleSave()
            break
          case "z":
            if (e.shiftKey) {
              e.preventDefault()
              handleRedo()
            } else {
              e.preventDefault()
              handleUndo()
            }
            break
          case "e":
            e.preventDefault()
            setShowPreview(!showPreview)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showPreview])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Landing
              </Link>
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">Landing Page Editor</h1>
              {hasUnsavedChanges && (
                <Badge variant="secondary" className="text-xs">
                  Unsaved changes
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Undo/Redo */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
                disabled={!canUndo}
                className="h-8 w-8 p-0"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRedo}
                disabled={!canRedo}
                className="h-8 w-8 p-0"
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo className="w-4 h-4" />
              </Button>
            </div>

            {/* Preview Mode */}
            {showPreview && (
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={previewMode === "desktop" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode("desktop")}
                  className="h-8 w-8 p-0"
                  title="Desktop view"
                >
                  <Monitor className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === "tablet" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode("tablet")}
                  className="h-8 w-8 p-0"
                  title="Tablet view"
                >
                  <TabletSmartphone className="w-4 h-4" />
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode("mobile")}
                  className="h-8 w-8 p-0"
                  title="Mobile view"
                >
                  <Smartphone className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Toggle Preview */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
              title="Toggle Preview (Ctrl+E)"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? "Hide" : "Show"} Preview
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="flex items-center gap-2 bg-transparent"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>

            <Button variant="outline" size="sm" asChild>
              <Link href="/" target="_blank" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Full Preview
              </Link>
            </Button>

            <Button size="sm" onClick={handleSave} disabled={isLoading} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      {/* Side-by-side layout with editor on left and preview on right */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Editor Panel */}
        <div className={`${showPreview ? "w-1/2" : "w-full"} border-r bg-background overflow-auto`}>
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6 sticky top-0 bg-background z-10">
                <TabsTrigger value="hero" className="relative">
                  Hero
                  {activeTab === "hero" && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="features" className="relative">
                  Features
                  {activeTab === "features" && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="pricing" className="relative">
                  Pricing
                  {activeTab === "pricing" && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="testimonials" className="relative">
                  Testimonials
                  {activeTab === "testimonials" && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="footer" className="relative">
                  Footer
                  {activeTab === "footer" && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="theme" className="relative">
                  Theme
                  {activeTab === "theme" && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="hero" className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      Hero Section
                      <Badge variant="outline" className="text-xs">
                        Above the fold
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HeroEditor config={config.hero} onChange={(data) => updateConfig("hero", data)} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      Features Section
                      <Badge variant="outline" className="text-xs">
                        {config.features.length} items
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FeaturesEditor config={config.features} onChange={(data) => updateConfig("features", data)} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      Pricing Section
                      <Badge variant="outline" className="text-xs">
                        {config.pricing.length} tiers
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PricingEditor config={config.pricing} onChange={(data) => updateConfig("pricing", data)} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="testimonials" className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      Testimonials Section
                      <Badge variant="outline" className="text-xs">
                        {config.testimonials.length} reviews
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TestimonialsEditor
                      config={config.testimonials}
                      onChange={(data) => updateConfig("testimonials", data)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="footer" className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle>Footer Section</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FooterEditor config={config.footer} onChange={(data) => updateConfig("footer", data)} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="theme" className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle>Theme Customization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ThemeEditor config={config.theme} onChange={(data) => updateConfig("theme", data)} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="w-1/2 bg-muted/30">
            <div className="sticky top-0 bg-background border-b px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Live Preview</span>
                <Badge variant="outline" className="text-xs capitalize">
                  {previewMode}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </div>
            <div className="h-[calc(100vh-8rem)] overflow-auto">
              <LivePreview config={config} previewMode={previewMode} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
