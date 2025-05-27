export const generateVerificationToken = () => {
  // Generate a 6-digit numeric verification token as a string
  return Math.floor(100000 + Math.random() * 900000).toString();
};
