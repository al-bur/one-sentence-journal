'use client'

import { formatDate } from '@/lib/utils'
import { Sparkles, Calendar } from 'lucide-react'

interface TimelineAnswer {
  id: string
  content: string
  created_at: string
  journal_daily_questions: {
    id: string
    question_date: string
    journal_questions: {
      id: string
      content: string
      category: string
    }
  }
}

interface TimelineListProps {
  answers: TimelineAnswer[]
}

export function TimelineList({ answers }: TimelineListProps) {
  if (answers.length === 0) {
    return (
      <div className="glass rounded-3xl p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
          <span className="text-4xl">📝</span>
        </div>
        <p className="text-lg font-medium mb-2">아직 작성한 답변이 없어요</p>
        <p className="text-muted-foreground mb-6">
          첫 번째 한줄일기를 작성해보세요
        </p>
        <a
          href="/today"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium hover:opacity-90 transition-opacity"
        >
          오늘의 질문에 답변하기
          <Sparkles className="w-4 h-4" />
        </a>
      </div>
    )
  }

  // 날짜별로 그룹화
  const groupedByMonth: Record<string, TimelineAnswer[]> = {}
  answers.forEach(answer => {
    const date = new Date(answer.journal_daily_questions.question_date)
    const monthKey = `${date.getFullYear()}년 ${date.getMonth() + 1}월`
    if (!groupedByMonth[monthKey]) {
      groupedByMonth[monthKey] = []
    }
    groupedByMonth[monthKey].push(answer)
  })

  return (
    <div className="space-y-8">
      {Object.entries(groupedByMonth).map(([month, monthAnswers]) => (
        <div key={month} className="space-y-4">
          {/* Month Header */}
          <div className="sticky top-0 z-10 py-3 bg-background/80 backdrop-blur-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                {month}
              </h2>
              <span className="text-xs text-muted-foreground">
                {monthAnswers.length}개
              </span>
            </div>
          </div>

          {/* Timeline Items */}
          <div className="space-y-4 relative">
            {/* Connecting Line */}
            <div className="absolute left-[11px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-primary/30 via-accent/20 to-transparent" />

            {monthAnswers.map((answer, index) => (
              <div
                key={answer.id}
                className="relative pl-8 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 top-4 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                {/* Card */}
                <div className="glass rounded-2xl p-5 card-hover">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(answer.journal_daily_questions.question_date)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {answer.journal_daily_questions.journal_questions.category}
                    </span>
                  </div>

                  {/* Question */}
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {answer.journal_daily_questions.journal_questions.content}
                  </p>

                  {/* Answer */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border/30">
                    <p className="text-foreground leading-relaxed">
                      {answer.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
