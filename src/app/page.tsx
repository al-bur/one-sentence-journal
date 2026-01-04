import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Clock, Users, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">한</span>
            </div>
            <span className="text-lg font-semibold">한줄일기</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                로그인
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">
                시작하기
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              매일 자정, 새로운 질문
            </div>

            {/* Headline */}
            <h1 className="text-display mb-6 text-balance">
              오늘의 나를,
              <br />
              <span className="text-primary">내일의 우리와</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto text-balance leading-relaxed">
              매일 자정 도착하는 질문에 한 문장으로 답하고,
              다음날 아침 소중한 사람들의 답변을 확인하세요.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-8 text-base rounded-xl">
                  무료로 시작하기
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-xl">
                  이미 계정이 있어요
                </Button>
              </Link>
            </div>

            {/* Trust Signal */}
            <p className="mt-6 text-sm text-muted-foreground">
              무료 · 광고 없음 · 1분 안에 시작
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-headline mb-4">
                어떻게 작동하나요?
              </h2>
              <p className="text-muted-foreground text-lg">
                세 단계로 시작하는 공유 일기
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
              {/* Step 1 */}
              <div className="card-elevated p-8 text-center">
                <div className="feature-icon feature-icon-blue mx-auto mb-5">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium text-primary mb-2">Step 1</div>
                <h3 className="text-title mb-3">자정에 질문 도착</h3>
                <p className="text-muted-foreground">
                  매일 자정, 새로운 질문이 앱에 나타납니다.
                  알림을 받을 수도 있어요.
                </p>
              </div>

              {/* Step 2 */}
              <div className="card-elevated p-8 text-center">
                <div className="feature-icon feature-icon-blue mx-auto mb-5">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium text-primary mb-2">Step 2</div>
                <h3 className="text-title mb-3">한 문장으로 답변</h3>
                <p className="text-muted-foreground">
                  100자 이내로 오늘의 생각을 담아주세요.
                  다음날 자정까지 작성할 수 있어요.
                </p>
              </div>

              {/* Step 3 */}
              <div className="card-elevated p-8 text-center">
                <div className="feature-icon feature-icon-green mx-auto mb-5">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-sm font-medium text-[#03C75A] mb-2">Step 3</div>
                <h3 className="text-title mb-3">아침에 함께 확인</h3>
                <p className="text-muted-foreground">
                  마치 편지처럼, 그룹원들의 답변이
                  다음날 아침 9시에 공개됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-headline mb-4">
                왜 한줄일기인가요?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: '부담 없는 한 문장',
                  description: '100자면 충분해요. 매일 쓰는 습관을 만들기에 딱 좋은 분량이에요.',
                },
                {
                  title: '의미 있는 질문들',
                  description: '일상부터 깊은 생각까지, 100가지 이상의 질문이 준비되어 있어요.',
                },
                {
                  title: '소중한 사람들과 연결',
                  description: '커플, 가족, 친구와 그룹을 만들고 서로의 하루를 들여다보세요.',
                },
                {
                  title: '쌓이는 추억',
                  description: '타임라인으로 지난 답변들을 모아보며 함께한 시간을 돌아봐요.',
                },
              ].map((benefit, i) => (
                <div key={i} className="flex gap-4 p-6 card-interactive">
                  <div className="shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-headline mb-4">
              오늘부터 시작해보세요
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              소중한 사람들과 매일 한 문장씩 마음을 나눠보세요.
            </p>
            <Link href="/signup">
              <Button size="lg" className="h-14 px-10 text-lg rounded-xl">
                무료로 시작하기
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">한</span>
              </div>
              <span className="text-sm text-muted-foreground">© 2026 한줄일기</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Made with care for meaningful connections
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
