import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies, headers } from 'next/headers';

const SALT_ROUNDS = 10;
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'honghong-simulator-secret-key-2024'
);
const COOKIE_NAME = 'auth-token';
const TOKEN_EXPIRY = '7d';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(userId: number, username: string): Promise<string> {
  const token = await new SignJWT({ userId, username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
  return token;
}

export async function verifyToken(token: string): Promise<{ userId: number; username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as number,
      username: payload.username as string,
    };
  } catch {
    return null;
  }
}

/**
 * Get auth info from cookie or Authorization header.
 * Supports both cookie-based and header-based auth for iframe compatibility.
 */
export async function getAuthFromCookie(): Promise<{ userId: number; username: string } | null> {
  // First try Authorization header (for iframe/preview compatibility)
  const headersList = await headers();
  const authHeader = headersList.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    return verifyToken(token);
  }

  // Fall back to cookie
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}
