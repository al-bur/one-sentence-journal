import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Toaster } from 'sonner'
import { Providers } from '@/components/providers'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: '한줄일기 - 오늘의 나를, 내일의 우리와',
    template: '%s | 한줄일기',
  },
  description: '매일 자정 새로운 질문에 한 문장으로 답하고, 다음날 아침 소중한 사람들의 답변을 확인하세요. 커플, 가족, 친구와 함께하는 감성 공유 일기.',
  keywords: ['일기', '공유일기', '커플일기', '가족일기', '질문일기', '한줄일기', '2026', '감성일기'],
  authors: [{ name: 'One Sentence Journal' }],
  metadataBase: new URL('https://one-sentence-journal-two.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://one-sentence-journal-two.vercel.app',
    siteName: '한줄일기',
    title: '한줄일기 - 오늘의 나를, 내일의 우리와',
    description: '매일 자정 새로운 질문에 한 문장으로 답하고, 다음날 아침 소중한 사람들의 답변을 확인하세요.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: '한줄일기 - 오늘의 나를, 내일의 우리와',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '한줄일기 - 오늘의 나를, 내일의 우리와',
    description: '매일 자정 새로운 질문에 한 문장으로 답하고, 다음날 아침 소중한 사람들의 답변을 확인하세요.',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${geist.variable} min-h-screen antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              color: '#1A1A1A',
              border: '1px solid rgba(124, 58, 237, 0.1)',
              boxShadow: '0 8px 32px rgba(124, 58, 237, 0.08)',
            },
          }}
        />
      </body>
    </html>
  )
}
