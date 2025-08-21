"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { landingConfig as defaultConfig } from "./landingConfig"

interface ConfigContextType {
  config: typeof defaultConfig
  updateConfig: (section: string, data: any) => void
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState(defaultConfig)

  const updateConfig = (section: string, data: any) => {
    setConfig((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  return <ConfigContext.Provider value={{ config, updateConfig }}>{children}</ConfigContext.Provider>
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider")
  }
  return context
}
