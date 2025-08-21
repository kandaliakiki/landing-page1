"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Upload, LinkIcon } from "lucide-react"

interface ImageUploadProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function ImageUpload({ value, onChange, placeholder }: ImageUploadProps) {
  const [inputMode, setInputMode] = useState<"url" | "upload">("url")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you would upload to a service like Vercel Blob
      const reader = new FileReader()
      reader.onload = (e) => {
        onChange(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={inputMode === "url" ? "default" : "outline"}
          size="sm"
          onClick={() => setInputMode("url")}
          className="flex items-center gap-2"
        >
          <LinkIcon className="w-4 h-4" />
          URL
        </Button>
        <Button
          type="button"
          variant={inputMode === "upload" ? "default" : "outline"}
          size="sm"
          onClick={() => setInputMode("upload")}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload
        </Button>
      </div>

      {inputMode === "url" ? (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Enter image URL"}
        />
      ) : (
        <div className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          {value && (
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Current image URL"
              className="text-sm"
            />
          )}
        </div>
      )}

      {value && (
        <div className="mt-2">
          <img
            src={value || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-32 object-cover rounded border"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg?height=128&width=256"
            }}
          />
        </div>
      )}
    </div>
  )
}
