import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, Users, Clock, ArrowRight } from 'lucide-react'
import { Aurora } from '@/components/ui/aurora'
import { BlurText } from '@/components/ui/blur-text'
import { ShinyText } from '@/components/ui/shiny-text'

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#09090B]">
      {/* Aurora Background */}
      <div className="absolute inset-0 opacity-60">
        <Aurora
          colorStops={['#A78BFA', '#F0ABFC', '#A78BFA']}
          amplitude={1.2}
          speed={0.8}
          blend={0.6}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090B]/50 to-[#09090B]" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-8">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">한줄일기</span>
            </div>
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                로그인
              </Button>
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <main className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto pt-20 pb-32">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="glass px-4 py-2 rounded-full inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <ShinyText
                  text="2026년 새로운 습관 만들기"
                  className="text-sm font-medium"
                  color="#A1A1AA"
                  shineColor="#FAFAFA"
                  speed={3}
                />
              </div>
            </div>

            {/* Headline */}
            <div className="text-center mb-8">
              <BlurText
                text="매일 밤, 한 문장으로"
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                delay={80}
                animateBy="words"
              />
              <BlurText
                text="마음을 나누세요"
                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight gradient-text mt-2"
                delay={80}
                animateBy="words"
              />
            </div>

            {/* Subheadline */}
            <p className="text-center text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '0.4s' }}>
              자정에 도착하는 질문에 답하고,<br className="hidden md:block" />
              다음날 아침 소중한 사람들의 답변을 확인하세요.
            </p>

            {/* CTA */}
            <div className="flex justify-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <Link href="/signup">
                <Button size="lg" className="group px-8 py-6 text-lg rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
                  무료로 시작하기
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="max-w-5xl mx-auto pb-32">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
              <div className="glass p-8 rounded-3xl card-hover">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6">
                  <Clock className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">매일 자정, 새로운 질문</h3>
                <p className="text-muted-foreground leading-relaxed">
                  100가지 이상의 의미있는 질문이 매일 자정 여러분을 찾아갑니다.
                </p>
              </div>

              <div className="glass p-8 rounded-3xl card-hover">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">소중한 사람들과 공유</h3>
                <p className="text-muted-foreground leading-relaxed">
                  커플, 가족, 친구 그룹을 만들고 서로의 하루를 들여다보세요.
                </p>
              </div>

              <div className="glass p-8 rounded-3xl card-hover">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-6">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">추억이 쌓이는 타임라인</h3>
                <p className="text-muted-foreground leading-relaxed">
                  지난 답변들을 타임라인으로 모아보며 함께한 시간을 돌아보세요.
                </p>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="max-w-3xl mx-auto pb-32">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
              <span className="gradient-text">어떻게</span> 작동하나요?
            </h2>

            <div className="space-y-8">
              <div className="flex items-start gap-6 glass p-6 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20">
                  1
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">자정에 질문이 도착해요</h4>
                  <p className="text-muted-foreground">매일 자정, 새로운 질문이 앱에 나타납니다.</p>
                </div>
              </div>

              <div className="flex items-start gap-6 glass p-6 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20">
                  2
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">100자 이내로 답변하세요</h4>
                  <p className="text-muted-foreground">한 문장으로 오늘의 생각을 담아주세요. 자정까지 작성 가능해요.</p>
                </div>
              </div>

              <div className="flex items-start gap-6 glass p-6 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-pink-400 flex items-center justify-center shrink-0 text-lg font-bold text-accent-foreground shadow-lg shadow-accent/20">
                  3
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">다음날 9시에 답변 공개</h4>
                  <p className="text-muted-foreground">마치 편지처럼, 그룹원들의 답변이 아침 9시에 공개됩니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="max-w-2xl mx-auto text-center pb-32">
            <div className="glass p-12 rounded-3xl subtle-glow">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                오늘부터 시작해보세요
              </h3>
              <p className="text-muted-foreground mb-8">
                소중한 사람들과 매일 한 문장씩 마음을 나눠보세요.
              </p>
              <Link href="/signup">
                <Button size="lg" className="px-8 py-6 text-lg rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300">
                  무료로 시작하기
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8">
          <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
            <p>© 2026 한줄일기. Made with love.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
