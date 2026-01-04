'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-sm">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">홈으로</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-6">
            <span className="text-primary-foreground font-bold text-lg">한</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">로그인</h1>
          <p className="text-muted-foreground">한줄일기에 오신 것을 환영합니다</p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl justify-start px-4 font-medium"
            onClick={handleGoogleLogin}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google로 계속하기
          </Button>

          <Button
            className="w-full h-12 rounded-xl justify-start px-4 font-medium bg-[#FEE500] hover:bg-[#FDD835] text-[#191919]"
            onClick={handleKakaoLogin}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#191919"
                d="M12 3C6.48 3 2 6.48 2 10.5c0 2.52 1.64 4.74 4.12 6.02-.18.64-.66 2.32-.76 2.68-.12.44.16.44.34.32.14-.1 2.26-1.54 3.2-2.16.68.1 1.4.14 2.1.14 5.52 0 10-3.48 10-7.5S17.52 3 12 3z"
              />
            </svg>
            카카오로 계속하기
          </Button>
        </div>

        {/* Divider */}
        <div className="my-8">
          <div className="divider" />
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground leading-relaxed">
          로그인하면{' '}
          <Link href="/terms" className="text-primary hover:underline">이용약관</Link>
          {' '}및{' '}
          <Link href="/privacy" className="text-primary hover:underline">개인정보처리방침</Link>
          에 동의하게 됩니다.
        </p>

        {/* Signup Link */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          아직 계정이 없으신가요?{' '}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
