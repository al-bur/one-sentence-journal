import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Moon, Users, Clock, BookOpen } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl aurora-bg" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl aurora-bg" style={{ animationDelay: '2s' }} />
      </div>

      {/* Stars */}
      <div className="absolute inset-0 stars-bg pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center animate-float">
                <Moon className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="text-lg font-semibold">2026 한줄일기</span>
            </div>
            <Link href="/signup">
              <Button size="sm">무료로 시작하기</Button>
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <main className="container mx-auto px-4 pt-20 pb-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Moon Icon */}
            <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-accent/20 flex items-center justify-center animate-float pulse-accent">
              <Moon className="w-10 h-10 text-accent" />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              매일 밤,<br />
              <span className="text-primary">한 문장</span>으로<br />
              마음을 나누세요
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
              자정에 도착하는 오늘의 질문에 답하고,<br />
              다음날 아침 9시에 소중한 사람들의 답변을 확인하세요.
            </p>

            <Link href="/signup">
              <Button size="xl" variant="accent">
                무료로 시작하기
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="max-w-4xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card/50 border border-border card-hover">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">매일 자정, 새로운 질문</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                100가지 이상의 의미있는 질문이 매일 자정 여러분을 찾아갑니다.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/50 border border-border card-hover">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">소중한 사람들과 공유</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                커플, 가족, 친구 그룹을 만들고 서로의 하루를 들여다보세요.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/50 border border-border card-hover">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">추억이 쌓이는 타임라인</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                지난 답변들을 타임라인으로 모아보며 함께한 시간을 돌아보세요.
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="max-w-2xl mx-auto mt-32 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-12">어떻게 작동하나요?</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold mb-1">자정에 질문이 도착해요</h4>
                  <p className="text-muted-foreground text-sm">매일 자정, 새로운 질문이 앱에 나타납니다.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold mb-1">100자 이내로 답변하세요</h4>
                  <p className="text-muted-foreground text-sm">한 문장으로 오늘의 생각을 담아주세요. 자정까지 작성 가능해요.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0 text-sm font-bold text-accent-foreground">
                  3
                </div>
                <div>
                  <h4 className="font-semibold mb-1">다음날 9시에 답변 공개</h4>
                  <p className="text-muted-foreground text-sm">마치 편지처럼, 그룹원들의 답변이 아침 9시에 공개됩니다.</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
            <p>2026 한줄일기. Made with love.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
