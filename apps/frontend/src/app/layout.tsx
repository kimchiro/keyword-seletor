import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '키워드 셀렉터 - 네이버 블로그 키워드 리서치',
  description: 'D.I.A 관점의 검색 의도 충족 글쓰기를 위한 키워드 리서치 도구',
  keywords: ['키워드 리서치', '네이버 블로그', 'SEO', '검색량', '트렌드'],
  authors: [{ name: '김동은' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: '키워드 셀렉터',
    description: '네이버 블로그 키워드 리서치 서비스',
    type: 'website',
    locale: 'ko_KR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
