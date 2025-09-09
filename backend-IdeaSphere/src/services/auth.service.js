import bcrypt from 'bcryptjs';

export async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
}

export async function verifyPassword(plainPassword, hashPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashPassword);
  return isMatch;
}
