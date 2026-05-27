"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import {
  clearAddProductDraft,
  loadAddProductDraft,
  saveAddProductDraft,
} from "@/lib/add-product-draft-storage"
import { clearAllSessionImagePreviews } from "@/lib/product-image-preview"
import {
  defaultAddProductFormValues,
  type AddProductFormValues,
} from "@/lib/add-product-form"

const AUTOSAVE_DELAY_MS = 500

export function useAddProductFormDraft() {
  const [initialDraft] = useState(() => loadAddProductDraft())
  const [formValues, setFormValues] = useState<AddProductFormValues>(
    () => initialDraft ?? defaultAddProductFormValues
  )
  const [restoredDraft, setRestoredDraft] = useState(() => initialDraft !== null)
  const skipNextSaveRef = useRef(false)

  const updateForm = useCallback((patch: Partial<AddProductFormValues>) => {
    setFormValues((current) => ({ ...current, ...patch }))
  }, [])

  const resetForm = useCallback(() => {
    skipNextSaveRef.current = true
    clearAllSessionImagePreviews()
    clearAddProductDraft()
    setFormValues(defaultAddProductFormValues)
    setRestoredDraft(false)
  }, [])

  const dismissRestoredDraft = useCallback(() => {
    setRestoredDraft(false)
  }, [])

  useEffect(() => {
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false
      return
    }

    const timeoutId = window.setTimeout(() => {
      saveAddProductDraft(formValues)
    }, AUTOSAVE_DELAY_MS)

    return () => window.clearTimeout(timeoutId)
  }, [formValues])

  return {
    formValues,
    updateForm,
    resetForm,
    restoredDraft,
    dismissRestoredDraft,
  }
}
