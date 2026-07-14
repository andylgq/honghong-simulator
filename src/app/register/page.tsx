'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '注册失败');
        return;
      }

      // Store token in localStorage for header-based auth (iframe compatibility)
      if (data.token) {
        localStorage.setItem('auth-token', data.token);
      }

      // Auto login success, redirect to home
      router.push('/');
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6"
      style={{ backgroundColor: '#FAF9F7' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💬</div>
          <h1 className="text-xl font-bold" style={{ color: '#2D2A26' }}>
            创建账号
          </h1>
          <p className="text-sm mt-2" style={{ color: '#8A8580' }}>
            注册后开始你的哄哄之旅
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#2D2A26' }}>
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名（2-50个字符）"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E8E5E2',
                color: '#2D2A26',
              }}
              required
              minLength={2}
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#2D2A26' }}>
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码（至少6位）"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E8E5E2',
                color: '#2D2A26',
              }}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm mb-1.5" style={{ color: '#2D2A26' }}>
              确认密码
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入密码"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E8E5E2',
                color: '#2D2A26',
              }}
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-sm text-center py-2 px-3 rounded-lg"
              style={{ backgroundColor: '#FFF0EE', color: '#E87170' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-white font-medium text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 mt-2"
            style={{ backgroundColor: '#F4A6A0' }}
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: '#8A8580' }}>
          已有账号？{' '}
          <Link href="/login" style={{ color: '#F4A6A0' }} className="font-medium">
            立即登录
          </Link>
        </p>

        <Link
          href="/"
          className="block text-center text-xs mt-4"
          style={{ color: '#B5B0AB' }}
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
