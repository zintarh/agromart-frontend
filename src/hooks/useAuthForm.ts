/**
 * Custom hook for handling form state with Yup validation
 * Integrates with auth and provides clean form handling
 */

import { useCallback, useMemo, useState } from "react"
import { ObjectSchema, ValidationError } from "yup"

interface UseAuthFormReturn<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isValid: boolean
  isSubmitting: boolean
  setValue: (field: keyof T, value: any) => void
  setValues: (values: T) => void
  setFieldError: (field: keyof T, error: string) => void
  setTouched: (field: keyof T, touched: boolean) => void
  validateField: (field: keyof T) => Promise<boolean>
  validateForm: () => Promise<boolean>
  resetForm: () => void
  setSubmitting: (submitting: boolean) => void
}

/**
 * Hook for managing form state with Yup validation
 */
export function useAuthForm<T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: ObjectSchema<any>
): UseAuthFormReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setSubmitting] = useState(false)

  const setValue = useCallback((field: keyof T, value: any) => {
    setValuesState((prev) => ({ ...prev, [field]: value }))
  }, [])

  const setValues = useCallback((newValues: T) => {
    setValuesState(newValues)
  }, [])

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }))
  }, [])

  const setTouched = useCallback((field: keyof T, touched: boolean) => {
    setTouchedState((prev) => ({ ...prev, [field]: touched }))
  }, [])

  const validateField = useCallback(
    async (field: keyof T): Promise<boolean> => {
      if (!validationSchema) return true

      try {
        // Create a schema for just this field
        const fieldSchema = (validationSchema as any).fields[field]
        if (!fieldSchema) return true

        await fieldSchema.validate(values[field])
        setFieldError(field, "")
        return true
      } catch (error) {
        if (error instanceof ValidationError) {
          setFieldError(field, error.message)
        }
        return false
      }
    },
    [validationSchema, values, setFieldError]
  )

  const validateForm = useCallback(async (): Promise<boolean> => {
    if (!validationSchema) return true

    try {
      await validationSchema.validate(values, { abortEarly: false })
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof ValidationError) {
        const newErrors: Partial<Record<keyof T, string>> = {}
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path as keyof T] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }, [validationSchema, values])

  const resetForm = useCallback(() => {
    setValuesState(initialValues)
    setErrors({})
    setTouchedState({})
    setSubmitting(false)
  }, [initialValues])

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 && Object.keys(values).length > 0
  }, [errors, values])

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    setValue,
    setValues,
    setFieldError,
    setTouched,
    validateField,
    validateForm,
    resetForm,
    setSubmitting,
  }
}
