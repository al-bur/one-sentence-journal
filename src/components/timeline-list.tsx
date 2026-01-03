'use client'

import { formatDate } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

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
      <div className="p-12 rounded-2xl bg-card border border-border text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-2xl">📝</span>
        </div>
        <p className="text-muted-foreground">
          아직 작성한 답변이 없어요
        </p>
        <a href="/today" className="text-primary hover:underline text-sm mt-2 inline-block">
          오늘의 질문에 답변하기 →
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
          <h2 className="text-lg font-semibold text-muted-foreground sticky top-0 bg-background py-2">
            {month}
          </h2>
          <div className="space-y-4">
            {monthAnswers.map((answer, index) => (
              <Card
                key={answer.id}
                className="animate-fade-in card-hover"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(answer.journal_daily_questions.question_date)}
                    </span>
                    <span className="text-xs text-primary uppercase tracking-wider">
                      {answer.journal_daily_questions.journal_questions.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Q. {answer.journal_daily_questions.journal_questions.content}
                  </p>
                  <p className="text-foreground leading-relaxed">
                    {answer.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
