import { NextResponse } from 'next/server';
import { getAuthFromCookie } from '@/lib/auth';

export async function GET() {
  const auth = await getAuthFromCookie();
  if (!auth) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }
  return NextResponse.json({
    user: { id: auth.userId, username: auth.username },
  });
}
