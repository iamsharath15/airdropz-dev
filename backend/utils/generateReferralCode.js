export function generateReferralCode(username) {
  // Make username lowercase and remove spaces for cleaner codes
  const cleanUsername = username.toLowerCase().replace(/\s+/g, '');

  // Generate a random 6-character alphanumeric string
  const randomStr = Math.random().toString(36).substring(2, 8);

  return `${cleanUsername}-${randomStr}`;
}
