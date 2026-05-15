/** Display fallback for missing super-admin numeric or empty values. */
export function displaySuperAdminValue(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "" || value === "—") {
    return "0"
  }
  return String(value)
}
