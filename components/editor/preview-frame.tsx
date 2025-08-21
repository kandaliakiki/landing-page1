"use client"

import { useEffect, useRef } from "react"

interface PreviewFrameProps {
  config: any
  previewMode: "desktop" | "tablet" | "mobile"
}

export function PreviewFrame({ config, previewMode }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

      if (iframeDoc) {
        const existingViewport = iframeDoc.querySelector('meta[name="viewport"]')
        if (!existingViewport) {
          const viewport = iframeDoc.createElement("meta")
          viewport.name = "viewport"
          viewport.content = "width=device-width, initial-scale=1"
          iframeDoc.head.appendChild(viewport)
        }

        // Inject the updated config into the iframe
        const configScript = `
          window.landingConfig = ${JSON.stringify(config)};
          if (window.updateLandingPage) {
            window.updateLandingPage(window.landingConfig);
          }
        `

        const existingScript = iframeDoc.getElementById("config-update")
        if (existingScript) {
          existingScript.remove()
        }

        const script = iframeDoc.createElement("script")
        script.id = "config-update"
        script.textContent = configScript
        iframeDoc.head.appendChild(script)
      }
    }
  }, [config])

  const getIframeStyles = () => {
    switch (previewMode) {
      case "mobile":
        return {
          width: "375px",
          height: "667px",
        }
      case "tablet":
        return {
          width: "768px",
          height: "1024px",
        }
      case "desktop":
      default:
        return {
          width: "100%",
          height: "100%",
        }
    }
  }

  const getContainerStyles = () => {
    switch (previewMode) {
      case "mobile":
        return {
          width: "375px",
          height: "667px",
          transform: "scale(0.85)",
          transformOrigin: "top center",
        }
      case "tablet":
        return {
          width: "768px",
          height: "1024px",
          transform: "scale(0.65)",
          transformOrigin: "top center",
        }
      case "desktop":
      default:
        return {
          width: "100%",
          height: "100%",
          transform: "scale(1)",
        }
    }
  }

  return (
    <div className="h-full flex items-start justify-center p-4 overflow-auto bg-muted/30">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden flex-shrink-0" style={getContainerStyles()}>
        <iframe
          ref={iframeRef}
          src="/"
          className="border-0 w-full h-full"
          style={getIframeStyles()}
          title="Live Preview"
        />
      </div>
    </div>
  )
}
