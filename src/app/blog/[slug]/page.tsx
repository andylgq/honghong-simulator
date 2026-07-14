'use client';

import { use } from 'react';
import Link from 'next/link';
import { getArticleBySlug } from '@/lib/blog-data';
import { notFound } from 'next/navigation';

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Split content into paragraphs
  const paragraphs = article.content.split('\n').filter((p: string) => p.trim());

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF9F7' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 border-b backdrop-blur-sm"
        style={{ borderColor: '#E8E5E2', backgroundColor: 'rgba(250, 249, 247, 0.9)' }}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/blog"
            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
            style={{ backgroundColor: '#F3F1EF' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2D2A26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <span className="text-sm" style={{ color: '#8A8580' }}>恋爱攻略</span>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Title */}
        <h1 className="text-xl font-bold mb-3" style={{ color: '#2D2A26' }}>
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ backgroundColor: '#FFE4DE', color: '#F4A6A0' }}>
            恋爱技巧
          </span>
          <span className="text-xs" style={{ color: '#B5B0AB' }}>
            {article.createdAt}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4">
          {paragraphs.map((paragraph: string, index: number) => (
            <p
              key={index}
              className="text-[15px] leading-relaxed"
              style={{ color: '#2D2A26' }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-10 pt-6 border-t" style={{ borderColor: '#E8E5E2' }}>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: '#F4A6A0' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            返回攻略列表
          </Link>
        </div>
      </div>
    </div>
  );
}
