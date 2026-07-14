import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getDb } from '@/storage/database/supabase-client';
import { users } from '@/storage/database/shared/schema';
import { hashPassword, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      );
    }
    if (username.length < 2 || username.length > 50) {
      return NextResponse.json(
        { error: '用户名长度需在 2-50 个字符之间' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: '密码长度不能少于 6 位' },
        { status: 400 }
      );
    }

    const db = getDb();

    // Check if username already exists
    const existingRows = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    if (existingRows.length > 0) {
      return NextResponse.json(
        { error: '用户名已存在' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const inserted = await db
      .insert(users)
      .values({ username, password: hashedPassword })
      .returning({ id: users.id, username: users.username });
    const user = inserted[0];

    // Create JWT token and set cookie
    const token = await createToken(user.id, user.username);
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username },
      token, // Also return token for localStorage-based auth (iframe compatibility)
    });
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}
