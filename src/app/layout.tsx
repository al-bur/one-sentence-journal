import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: '한줄일기',
    template: '%s | 한줄일기',
  },
  description: '매일 자정, 단 한 문장의 질문에 답하고 다음날 아침 서로의 답변을 확인하세요.',
  keywords: ['일기', '공유일기', '커플일기', '가족일기', '질문일기', '한줄일기'],
  authors: [{ name: 'One Sentence Journal' }],
  metadataBase: new URL('https://one-sentence-journal.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://one-sentence-journal.vercel.app',
    siteName: '한줄일기',
    title: '한줄일기 - 매일 한 문장으로 마음을 나누세요',
    description: '매일 자정, 단 한 문장의 질문에 답하고 다음날 아침 서로의 답변을 확인하세요.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: '한줄일기',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '한줄일기',
    description: '매일 자정, 단 한 문장의 질문에 답하고 다음날 아침 서로의 답변을 확인하세요.',
    images: ['/og-image.png'],
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
      <body className={`${geist.variable} min-h-screen antialiased`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1E293B',
              color: '#F8FAFC',
              border: '1px solid #334155',
            },
          }}
        />
      </body>
    </html>
  )
}
