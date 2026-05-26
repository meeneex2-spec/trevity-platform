import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import TwemojiBoot from '@/components/TwemojiBoot';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trevity — 글로벌 인플루언서 여행 체험 플랫폼',
  description:
    '트래비티는 글로벌 브랜드와 인플루언서를 연결하는 여행 체험 플랫폼입니다. 호텔, 마사지, 맛집, 액티비티 등 다양한 여행 캠페인을 경험하세요.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Toaster position="top-center" richColors />
        <TwemojiBoot />
      </body>
    </html>
  );
}
