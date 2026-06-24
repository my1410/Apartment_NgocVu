import jwt from 'jsonwebtoken';

export function signAuthToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite = process.env.COOKIE_SAMESITE || (isProduction ? 'none' : 'lax');
  const secure = process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === 'true'
    : isProduction || sameSite === 'none';

  return {
    httpOnly: true,
    signed: true,
    secure,
    sameSite,
    domain: process.env.COOKIE_DOMAIN || undefined,
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}
