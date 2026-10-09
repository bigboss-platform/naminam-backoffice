/** Live rule list under the new-password field (workspace rule: list every broken rule). Shared client + server. */
export const PASSWORD_RULES = [
  { id: 'length', label: 'Mínimo 8 caracteres', test: (value: string) => value.length >= 8 },
  { id: 'letter', label: 'Al menos una letra', test: (value: string) => /[a-zA-Z]/.test(value) },
  { id: 'number', label: 'Al menos un número', test: (value: string) => /\d/.test(value) },
] as const;

export function isStrongPassword(value: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(value));
}
