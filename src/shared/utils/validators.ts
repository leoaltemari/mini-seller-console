/**
 * Validates if the provided string is a valid email address.
 *
 * This function uses a regular expression to check if the input string
 * adheres to the general format of an email address (e.g., "example@domain.com").
 *
 * @param email - The email address to validate.
 * @returns `true` if the email is valid, otherwise `false`.
 */
export function isValidEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}
