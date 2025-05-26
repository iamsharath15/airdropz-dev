export function generateReferralCode(username) {
  return `${username}-${Math.random().toString(36).substring(2, 8)}`;
}
