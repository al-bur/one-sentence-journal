'use client'

import { formatDate } from '@/lib/utils'
import { ArrowRight, Calendar } from 'lucide-react'

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
      <div className="card-elevated p-12 text-center">
        <div className="empty-state-icon">
          <span className="text-3xl">📝</span>
        </div>
        <p className="text-lg font-medium mb-2">아직 작성한 답변이 없어요</p>
        <p className="text-muted-foreground mb-6">
          첫 번째 한줄일기를 작성해보세요
        </p>
        <a
          href="/today"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
        >
          오늘의 질문에 답변하기
          <ArrowRight className="w-4 h-4" />
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
          <div className="sticky top-0 z-10 py-3 bg-background/95 backdrop-blur-sm">
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
            <div className="absolute left-[11px] top-6 bottom-6 w-[2px] bg-border" />

            {monthAnswers.map((answer, index) => (
              <div
                key={answer.id}
                className="relative pl-8 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 top-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>

                {/* Card */}
                <div className="card-interactive p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(answer.journal_daily_questions.question_date)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                      {answer.journal_daily_questions.journal_questions.category}
                    </span>
                  </div>

                  {/* Question */}
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {answer.journal_daily_questions.journal_questions.content}
                  </p>

                  {/* Answer */}
                  <div className="p-4 rounded-xl bg-secondary border border-border">
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
