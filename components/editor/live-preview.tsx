"use client";

import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

interface LivePreviewProps {
  config: any;
  previewMode: "desktop" | "tablet" | "mobile";
}

export function LivePreview({ config, previewMode }: LivePreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const getPreviewDimensions = () => {
    switch (previewMode) {
      case "mobile":
        return { width: 375, height: 812, label: "Mobile (375px)", scale: 1 };
      case "tablet":
        return {
          width: 768,
          height: 1024,
          label: "Tablet (768px)",
          scale: 0.8,
        };
      case "desktop":
      default:
        return { width: 1200, height: 800, label: "Desktop", scale: 0.65 };
    }
  };

  const dimensions = getPreviewDimensions();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIframeKey((prev) => prev + 1); // Force iframe reload
      setTimeout(() => setIsLoading(false), 500); // Show loading for smooth UX
    }, 100);

    return () => clearTimeout(timer);
  }, [previewMode]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow && !isLoading) {
      try {
        iframe.contentWindow.postMessage(
          { type: "CONFIG_UPDATE", config },
          "*"
        );
      } catch (error) {
        console.log("[v0] Could not update iframe config:", error);
      }
    }
  }, [config, iframeKey, isLoading]);

  const getIframeUrl = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      preview: "true",
      mode: previewMode,
      // Do NOT include config in the URL to avoid exceeding URL length limits
      // and to prevent encoding issues with large base64 image data.
      ts: String(Date.now()), // cache-buster to ensure fresh load when needed
    });
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b bg-background/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Live Preview</span>
          <Badge variant="outline" className="text-xs">
            {dimensions.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 flex items-center justify-center p-4 bg-gray-100 overflow-auto">
        <div
          className="relative flex-shrink-0"
          style={{
            width: dimensions.width * dimensions.scale,
            height: dimensions.height * dimensions.scale,
          }}
        >
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                <span className="text-sm text-gray-600">
                  Loading {dimensions.label}...
                </span>
              </div>
            </div>
          )}

          <iframe
            key={iframeKey}
            id={`preview-iframe-${iframeKey}`}
            ref={iframeRef}
            src={getIframeUrl()}
            className="w-full h-full border rounded-lg shadow-lg bg-white"
            style={{
              width: dimensions.width,
              height: dimensions.height,
              transform: `scale(${dimensions.scale})`,
              transformOrigin: "top left",
              opacity: isLoading ? 0.3 : 1,
              transition: "opacity 0.3s ease",
            }}
            onLoad={() => {
              setIsLoading(false);
              const iframe = iframeRef.current;
              if (iframe && iframe.contentWindow) {
                try {
                  iframe.contentWindow.postMessage(
                    { type: "CONFIG_UPDATE", config },
                    "*"
                  );
                } catch (error) {
                  console.log("[v0] Could not send config on load:", error);
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
