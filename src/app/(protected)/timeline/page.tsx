import { createClient } from '@/lib/supabase/server'
import { TimelineList } from '@/components/timeline-list'

export const metadata = {
  title: '타임라인',
}

export default async function TimelinePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  interface TimelineAnswerRaw {
    id: string
    content: string
    created_at: string | null
    journal_daily_questions: {
      id: string
      question_date: string
      journal_questions: {
        id: string
        content: string
        category: string | null
      } | null
    } | null
  }

  // 내 답변들 가져오기 (최신순)
  const { data: answersData } = await supabase
    .from('journal_answers')
    .select(`
      id,
      content,
      created_at,
      journal_daily_questions (
        id,
        question_date,
        journal_questions (
          id,
          content,
          category
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  // 타입 변환 및 필터링
  const answers = (answersData as TimelineAnswerRaw[] || [])
    .filter(a => a.journal_daily_questions?.journal_questions)
    .map(a => ({
      id: a.id,
      content: a.content,
      created_at: a.created_at || new Date().toISOString(),
      journal_daily_questions: {
        id: a.journal_daily_questions!.id,
        date: a.journal_daily_questions!.question_date,
        journal_questions: {
          id: a.journal_daily_questions!.journal_questions!.id,
          content: a.journal_daily_questions!.journal_questions!.content,
          category: a.journal_daily_questions!.journal_questions!.category || '일상',
        },
      },
    }))

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">타임라인</h1>
        <p className="text-muted-foreground text-sm mt-1">나의 한줄일기 모아보기</p>
      </div>

      <TimelineList answers={answers} />
    </div>
  )
}
