import { createClient } from '@/lib/supabase/server'
import { TodayQuestion } from '@/components/today-question'
import { GroupAnswers } from '@/components/group-answers'
import { formatDate, isAnswerRevealed, getTimeUntilReveal } from '@/lib/utils'

export const metadata = {
  title: '오늘의 질문',
}

interface GroupMembership {
  journal_groups: {
    id: string
    name: string
  } | null
}

interface DailyQuestionWithQuestion {
  id: string
  question_date: string
  journal_questions: {
    id: string
    content: string
    category: string
  } | null
}

export default async function TodayPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // 오늘 날짜 (YYYY-MM-DD)
  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  // 오늘의 질문 가져오기
  const { data: dailyQuestionData } = await supabase
    .from('journal_daily_questions')
    .select(`
      id,
      question_date,
      journal_questions (
        id,
        content,
        category
      )
    `)
    .eq('question_date', todayStr)
    .single()

  const dailyQuestion = dailyQuestionData as DailyQuestionWithQuestion | null

  // 내 그룹 가져오기
  const { data: myGroups } = await supabase
    .from('journal_group_members')
    .select(`
      journal_groups (
        id,
        name
      )
    `)
    .eq('user_id', user.id)

  const memberships = (myGroups || []) as GroupMembership[]
  const groups = memberships.map(g => g.journal_groups).filter(Boolean) as { id: string; name: string }[]

  // 내 답변 가져오기
  let myAnswer = null
  if (dailyQuestion) {
    const { data } = await supabase
      .from('journal_answers')
      .select('*')
      .eq('daily_question_id', dailyQuestion.id)
      .eq('user_id', user.id)
      .single()
    myAnswer = data
  }

  // 그룹원들의 답변 가져오기 (9시 이후에만 표시)
  const revealed = isAnswerRevealed(todayStr)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <p className="text-muted-foreground text-sm mb-2">{formatDate(today)}</p>
        <h1 className="text-2xl font-bold">오늘의 질문</h1>
      </div>

      {/* Question Card */}
      {dailyQuestion?.journal_questions ? (
        <TodayQuestion
          question={dailyQuestion.journal_questions as { id: string; content: string; category: string }}
          dailyQuestionId={dailyQuestion.id}
          myAnswer={myAnswer}
          userId={user.id}
        />
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>오늘의 질문이 아직 없습니다.</p>
          <p className="text-sm mt-2">자정에 새로운 질문이 도착합니다.</p>
        </div>
      )}

      {/* Group Answers */}
      {groups.length > 0 && dailyQuestion && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">그룹원들의 답변</h2>
            {!revealed && (
              <span className="text-xs text-muted-foreground">
                {getTimeUntilReveal()} 후 공개
              </span>
            )}
          </div>
          {revealed ? (
            <GroupAnswers
              dailyQuestionId={dailyQuestion.id}
              userId={user.id}
              groups={groups}
            />
          ) : (
            <div className="p-8 rounded-2xl bg-card border border-border text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                <span className="text-2xl">✉️</span>
              </div>
              <p className="text-muted-foreground">
                그룹원들의 답변은<br />
                내일 아침 9시에 공개됩니다
              </p>
            </div>
          )}
        </div>
      )}

      {/* No group prompt */}
      {groups.length === 0 && (
        <div className="p-6 rounded-2xl bg-card border border-border text-center">
          <p className="text-muted-foreground mb-4">
            아직 참여중인 그룹이 없어요
          </p>
          <a href="/group" className="text-primary hover:underline text-sm">
            그룹 만들기 →
          </a>
        </div>
      )}
    </div>
  )
}
