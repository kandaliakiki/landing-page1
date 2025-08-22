"use client";

import { useState, useCallback, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Eye,
  Save,
  Monitor,
  TabletSmartphone,
  Smartphone,
  Undo,
  Redo,
  Download,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { landingConfig } from "@/lib/landingConfig";
import { HeroEditor } from "./hero-editor";
import { FeaturesEditor } from "./features-editor";
import { PricingEditor } from "./pricing-editor";
import { TestimonialsEditor } from "./testimonials-editor";
import { FooterEditor } from "./footer-editor";
import { ThemeEditor } from "./theme-editor";
import { HeaderEditor } from "./header-editor";
import { CopyEditor } from "./copy-editor";
import { LivePreview } from "./live-preview";
import JSZip from "jszip";
import { useUndoRedo } from "@/hooks/use-undo-redo";
import { toast } from "@/hooks/use-toast";

export function EditorInterface() {
  const [config, setConfig] = useState(landingConfig);
  const [activeTab, setActiveTab] = useState("hero");
  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");
  const [showPreview, setShowPreview] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { history, currentIndex, pushToHistory, undo, redo, canUndo, canRedo } =
    useUndoRedo(config);

  const updateConfig = useCallback(
    (section: string, data: any) => {
      const newConfig = {
        ...config,
        [section]: data,
      };
      setConfig(newConfig);
      pushToHistory(newConfig);
      setHasUnsavedChanges(true);
    },
    [config, pushToHistory]
  );

  const handleUndo = () => {
    const previousConfig = undo();
    if (previousConfig) {
      setConfig(previousConfig);
      setHasUnsavedChanges(true);
    }
  };

  const handleRedo = () => {
    const nextConfig = redo();
    if (nextConfig) {
      setConfig(nextConfig);
      setHasUnsavedChanges(true);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setHasUnsavedChanges(false);
      try {
        localStorage.setItem("landingSavedConfig", JSON.stringify(config));
        sessionStorage.setItem("landingPreviewConfig", JSON.stringify(config));
      } catch (err) {
        console.log("[v0] Could not persist saved config:", err);
      }
      toast({
        title: "Changes saved",
        description: "Your landing page has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description:
          "There was an error saving your changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const publishZip = async () => {
    try {
      const base = window.location.origin;
      // Try hosted (public/site) first, then offline root
      let prefix = "site";
      let res = await fetch(`${base}/site/manifest.json`);
      if (!res.ok) {
        res = await fetch(`${base}/manifest.json`);
        prefix = "";
      }
      if (!res.ok) throw new Error("manifest not found; run publish:offline");
      const { files } = await res.json();
      const zip = new JSZip();
      for (const rel of files) {
        if (
          rel === "manifest.json" ||
          rel === "editor.html" ||
          rel.startsWith("editor/")
        ) {
          continue;
        }
        const url = prefix ? `${base}/${prefix}/${rel}` : `${base}/${rel}`;
        const response = await fetch(url);
        const blob = await response.blob();
        const arr = new Uint8Array(await blob.arrayBuffer());
        zip.file(rel, arr);
      }
      const indexUrl = prefix
        ? `${base}/${prefix}/index.html`
        : `${base}/index.html`;
      let indexText = await fetch(indexUrl).then((r) => r.text());
      // Ensure the published title is neutral and not the default from base HTML
      indexText = indexText.replace(
        /<title>[\s\S]*?<\/title>/i,
        "<title>Landing Page</title>"
      );
      const publishConfig = {
        ...config,
        header: {
          ...(config as any).header,
          showEditorLink: false,
        },
      } as any;
      const injected = indexText.replace(
        /<body[^>]*>/i,
        (m) =>
          `${m}\n<script>(function(){var cfg=${JSON.stringify(
            publishConfig
          )};try{localStorage.setItem('landingSavedConfig',JSON.stringify(cfg));sessionStorage.setItem('landingPreviewConfig',JSON.stringify(cfg));}catch(e){};window.__CONFIG__=cfg;})();<\/script>`
      );
      zip.file("index.html", injected);
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "site.zip";
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Published", description: "Downloaded site.zip" });
    } catch (err) {
      toast({
        title: "Publish failed",
        description: (err as any)?.message || "Could not generate ZIP",
        variant: "destructive",
      });
    }
  };

  function escapeHtml(value: string | undefined) {
    return (value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function aTag(href?: string, label?: string, primary?: boolean) {
    return `<a class=\"btn ${primary ? "primary" : ""}\" href=\"${
      href || "#"
    }\">${escapeHtml(label)}</a>`;
  }

  function renderStatic(cfg: any) {
    const header = `<header><div><strong>${escapeHtml(
      cfg.header?.brandName
    )}</strong></div>${aTag(
      cfg.header?.ctaHref,
      cfg.header?.ctaLabel,
      true
    )}</header>`;
    const hero = `<section><h1>${escapeHtml(
      cfg.hero?.headline
    )}</h1><p class=\"muted\">${escapeHtml(cfg.hero?.subheadline)}</p>${aTag(
      cfg.hero?.ctaPrimaryHref,
      cfg.hero?.ctaText,
      true
    )} ${aTag(cfg.hero?.ctaSecondaryHref, cfg.hero?.ctaSecondary)}</section>`;
    const tiers = (cfg.pricing || [])
      .map(
        (t: any) =>
          `<div style=\"border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin:12px 0\">` +
          `<div style=\"font-weight:800\">${escapeHtml(t.name)}</div>` +
          `<div class=\"muted\">${escapeHtml(t.description)}</div>` +
          `<div style=\"margin:8px 0;font-weight:800\">${escapeHtml(
            t.price
          )} <span class=\"muted\">/${escapeHtml(t.period)}</span></div>` +
          `${aTag(t.ctaHref, t.ctaText, !!t.popular)}` +
          `</div>`
      )
      .join("");
    const pricing = `<section><h2>${escapeHtml(
      cfg.sections?.pricing?.title || "Pricing"
    )}</h2><p class=\"muted\">${escapeHtml(
      cfg.sections?.pricing?.subtitle
    )}</p>${tiers}</section>`;
    return header + hero + pricing;
  }

  // Import JSON (merge with defaults)
  const mergeWithDefaults = (incoming: any) => {
    if (!incoming) return landingConfig as any;
    return {
      ...landingConfig,
      ...incoming,
      header: {
        ...(landingConfig as any).header,
        ...(incoming as any).header,
      },
      sections: {
        ...(landingConfig as any).sections,
        ...((incoming as any).sections || {}),
      },
    } as typeof landingConfig;
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const merged = mergeWithDefaults(parsed);
      setConfig(merged);
      pushToHistory(merged);
      setHasUnsavedChanges(true);
      try {
        sessionStorage.setItem("landingPreviewConfig", JSON.stringify(merged));
      } catch {}
      toast({
        title: "Config imported",
        description: "Your JSON was merged and applied.",
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Invalid JSON file. Please check and try again.",
        variant: "destructive",
      });
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            handleSave();
            break;
          case "z":
            if (e.shiftKey) {
              e.preventDefault();
              handleRedo();
            } else {
              e.preventDefault();
              handleUndo();
            }
            break;
          case "e":
            e.preventDefault();
            setShowPreview(!showPreview);
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showPreview]);

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
              {showPreview ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              {showPreview ? "Hide" : "Show"} Preview
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={publishZip}
              className="flex items-center gap-2 bg-transparent"
              title="Publish static ZIP"
            >
              <Download className="w-4 h-4" />
              Publish ZIP
            </Button>

            <Button variant="outline" size="sm" asChild>
              <Link
                href="/?preview=true"
                target="_blank"
                className="flex items-center gap-2"
                onClick={() => {
                  try {
                    localStorage.setItem(
                      "landingPreviewConfig",
                      JSON.stringify(config)
                    );
                  } catch (err) {
                    console.log(
                      "[v0] Could not persist preview config before opening full preview:",
                      err
                    );
                  }
                }}
              >
                <Eye className="w-4 h-4" />
                Full Preview
              </Link>
            </Button>

            <Button
              size="sm"
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </header>

      {/* Side-by-side layout with editor on left and preview on right */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Editor Panel */}
        <div
          className={`${
            showPreview ? "w-1/2" : "w-full"
          } border-r bg-background overflow-auto`}
        >
          <div className="p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-8 sticky top-0 bg-background z-10">
                <TabsTrigger value="header" className="relative">
                  Header
                  {activeTab === "header" && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </TabsTrigger>
                <TabsTrigger value="copy" className="relative">
                  Content
                  {activeTab === "copy" && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </TabsTrigger>
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
                {/* Theme tab removed per request */}
              </TabsList>
              <TabsContent value="header" className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle>Header</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HeaderEditor
                      config={config.header}
                      onChange={(data) => updateConfig("header", data)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="copy" className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle>Section Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CopyEditor
                      config={config.sections}
                      onChange={(data) => updateConfig("sections", data)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

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
                    <HeroEditor
                      config={config.hero}
                      onChange={(data) => updateConfig("hero", data)}
                    />
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
                    <FeaturesEditor
                      config={config.features}
                      onChange={(data) => updateConfig("features", data)}
                    />
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
                    <PricingEditor
                      config={config.pricing}
                      onChange={(data) => updateConfig("pricing", data)}
                    />
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
                    <FooterEditor
                      config={config.footer}
                      onChange={(data) => updateConfig("footer", data)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Theme content removed */}
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
  );
}
