import { useCallback, useMemo, useRef, useState } from "react"
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

interface UseAuthFormOptions {
  validateOnChange?: boolean
}

export function useAuthForm<T extends Record<string, any>>(
  initialValues: T,
  validationSchema?: ObjectSchema<any>,
  { validateOnChange = false }: UseAuthFormOptions = {}
): UseAuthFormReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setSubmitting] = useState(false)

  // Always-fresh ref so callbacks can read latest values without going stale
  const valuesRef = useRef(values)
  valuesRef.current = values

  const runValidation = useCallback(
    async (currentValues: T) => {
      if (!validationSchema) return
      try {
        await validationSchema.validate(currentValues, { abortEarly: false })
        setErrors({})
      } catch (error) {
        if (error instanceof ValidationError) {
          const newErrors: Partial<Record<keyof T, string>> = {}
          error.inner.forEach((err) => {
            if (err.path) newErrors[err.path as keyof T] = err.message
          })
          setErrors(newErrors)
        }
      }
    },
    [validationSchema]
  )

  const setValue = useCallback(
    (field: keyof T, value: any) => {
      setValuesState((prev) => {
        const next = { ...prev, [field]: value }
        if (validateOnChange) runValidation(next)
        return next
      })
    },
    [validateOnChange, runValidation]
  )

  const setValues = useCallback((newValues: T) => {
    setValuesState(newValues)
  }, [])

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }))
  }, [])

  // Marking a field as touched also triggers a full validation pass so
  // errors are visible immediately on blur (not only on submit).
  const setTouched = useCallback(
    (field: keyof T, isTouched: boolean) => {
      setTouchedState((prev) => ({ ...prev, [field]: isTouched }))
      if (isTouched) runValidation(valuesRef.current)
    },
    [runValidation]
  )

  const validateField = useCallback(
    async (field: keyof T): Promise<boolean> => {
      if (!validationSchema) return true
      try {
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
          if (err.path) newErrors[err.path as keyof T] = err.message
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

  const isValid = useMemo(
    () => Object.keys(errors).length === 0 && Object.keys(values).length > 0,
    [errors, values]
  )

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
