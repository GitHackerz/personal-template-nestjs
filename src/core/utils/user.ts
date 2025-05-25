export function generateUsernameFromEmail(
  email: string,
  suffix?: number,
): string {
  const emailParts = email.split('@');
  let namePart = emailParts[0].replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

  if (suffix) {
    namePart = `${namePart}_${suffix}`;
  }

  return namePart;
}
