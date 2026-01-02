'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Moon } from 'lucide-react'

export default function SignupPage() {
  const supabase = createClient()

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message)
    }
  }

  async function handleKakaoLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl aurora-bg" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl aurora-bg" style={{ animationDelay: '2s' }} />
      </div>
      <div className="absolute inset-0 stars-bg pointer-events-none" />

      <Card className="w-full max-w-md relative z-10">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center animate-float">
              <Moon className="w-6 h-6 text-accent-foreground" />
            </div>
          </Link>
          <CardTitle className="text-2xl">2026 한줄일기 시작하기</CardTitle>
          <CardDescription>매일 한 문장으로 마음을 나누세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full h-12"
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google로 시작하기
          </Button>

          <Button
            variant="outline"
            className="w-full h-12 bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] border-[#FEE500]"
            onClick={handleKakaoLogin}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 3C6.48 3 2 6.48 2 10.5c0 2.52 1.64 4.74 4.12 6.02-.18.64-.66 2.32-.76 2.68-.12.44.16.44.34.32.14-.1 2.26-1.54 3.2-2.16.68.1 1.4.14 2.1.14 5.52 0 10-3.48 10-7.5S17.52 3 12 3z"
              />
            </svg>
            카카오로 시작하기
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6 pt-4">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-primary hover:underline">
              로그인
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground">
            가입하면{' '}
            <Link href="/terms" className="underline">이용약관</Link>
            {' '}및{' '}
            <Link href="/privacy" className="underline">개인정보처리방침</Link>
            에 동의하게 됩니다.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
