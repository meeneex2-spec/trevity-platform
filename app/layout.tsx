import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import TwemojiBoot from '@/components/TwemojiBoot';
import HtmlLang from '@/components/HtmlLang';
import { SEO, SITE_URL } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SEO.ko.title,
  description: SEO.ko.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 실제 lang 속성은 각 언어 페이지에서 HtmlLang 이 클라이언트에서 교정한다.
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
        <HtmlLang />
        {children}
        <Toaster position="top-center" richColors />
        <TwemojiBoot />
      </body>
    </html>
  );
}
