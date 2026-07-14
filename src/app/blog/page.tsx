'use client';

import Link from 'next/link';
import { getAllArticles } from '@/lib/blog-data';

export default function BlogListPage() {
  const articles = getAllArticles();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F7' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b backdrop-blur-sm"
        style={{ borderColor: '#E8E5E2', backgroundColor: 'rgba(250, 249, 247, 0.9)' }}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
            style={{ backgroundColor: '#F3F1EF' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D2A26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="text-lg font-medium" style={{ color: '#2D2A26' }}>恋爱攻略</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <p className="text-sm mb-6" style={{ color: '#8A8580' }}>
          哄好 TA 的小技巧，轻松又实用
        </p>

        <div className="flex flex-col gap-4">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="block rounded-2xl p-5 transition-all duration-200 hover:scale-[1.01]"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E8E5E2',
              }}
            >
              <h2 className="text-base font-medium mb-2" style={{ color: '#2D2A26' }}>
                {article.title}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#8A8580' }}>
                {article.summary}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#FFE4DE', color: '#F4A6A0' }}>
                  恋爱技巧
                </span>
                <span className="text-xs" style={{ color: '#B5B0AB' }}>
                  {article.createdAt}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
