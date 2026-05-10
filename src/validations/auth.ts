/**
 * Yup validation schemas for auth forms
 */

import * as yup from "yup"

/**
 * Shared field validation rules
 */
const passwordValidation = yup
  .string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[0-9]/, "Password must contain at least one number")

const emailValidation = yup
  .string()
  .required("Email is required")
  .email("Enter a valid email address")

const phoneValidation = yup
  .string()
  .required("Phone number is required")
  .matches(/^[0-9\s+\-()]+$/, "Phone number must contain only digits and + - ( ) symbols")

/**
 * Registration form schema
 */
export const registerSchema = yup.object().shape({
  first_name: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  last_name: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: emailValidation,
  password: passwordValidation,
  confirm_password: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
  phone: phoneValidation,
  country_code: yup.string().optional().default("234"),
  agree_terms: yup
    .boolean()
    .required("You must agree to the terms and conditions"),
})

/**
 * Email verification form schema
 */
export const verifyEmailSchema = yup.object().shape({
  email: emailValidation,
  token: yup
    .string()
    .required("Verification code is required")
    .matches(/^[0-9]{6}$/, "Verification code must be 6 digits"),
})

/**
 * Resend verification form schema
 */
export const resendVerificationSchema = yup.object().shape({
  email: emailValidation,
})

/**
 * Login form schema
 */
export const loginSchema = yup.object().shape({
  email: emailValidation,
  password: yup.string().required("Password is required"),
})

/**
 * Forgot password form schema
 */
export const forgotPasswordSchema = yup.object().shape({
  email: emailValidation,
})

/**
 * New password step schema (token collected separately)
 */
export const newPasswordSchema = yup.object().shape({
  new_password: passwordValidation,
  confirm_password: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("new_password")], "Passwords must match"),
})

/**
 * Reset password form schema
 */
export const resetPasswordSchema = yup.object().shape({
  // Email is collected in the request-reset step and passed separately.
  email: yup.string().email("Enter a valid email address").optional(),
  token: yup
    .string()
    .required("Reset code is required")
    .matches(/^[0-9]{6}$/, "Reset code must be 6 digits"),
  new_password: passwordValidation,
  confirm_password: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("new_password")], "Passwords must match"),
})

/**
 * Complete invite form schema
 */
export const completeInviteSchema = yup.object().shape({
  token: yup.string().required("Invitation token is required"),
  first_name: yup
    .string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters"),
  last_name: yup
    .string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters"),
  password: passwordValidation,
  confirm_password: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
  phone: phoneValidation,
  country_code: yup.string().optional().default("234"),
})
