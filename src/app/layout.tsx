import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '哄哄模拟器',
  description: '一款AI对话模拟游戏，通过选择对话来哄好生气的女朋友',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
