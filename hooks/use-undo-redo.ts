"use client"

import { useState, useCallback } from "react"

export function useUndoRedo<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState])
  const [currentIndex, setCurrentIndex] = useState(0)

  const pushToHistory = useCallback(
    (newState: T) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, currentIndex + 1)
        newHistory.push(newState)
        // Limit history to 50 items
        if (newHistory.length > 50) {
          newHistory.shift()
          setCurrentIndex((prev) => prev - 1)
          return newHistory
        }
        setCurrentIndex(newHistory.length - 1)
        return newHistory
      })
    },
    [currentIndex],
  )

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      return history[newIndex]
    }
    return null
  }, [currentIndex, history])

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      return history[newIndex]
    }
    return null
  }, [currentIndex, history])

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  return {
    history,
    currentIndex,
    pushToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  }
}
