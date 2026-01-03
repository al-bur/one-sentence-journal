import { createClient } from '@/lib/supabase/server'
import { TodayQuestion } from '@/components/today-question'
import { GroupAnswers } from '@/components/group-answers'
import { formatDate, isAnswerRevealed, getTimeUntilReveal } from '@/lib/utils'
import { Sparkles, Users, Clock } from 'lucide-react'

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

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

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

  const revealed = isAnswerRevealed(todayStr)

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="text-center space-y-2">
        <p className="text-muted-foreground text-sm">{formatDate(today)}</p>
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text">오늘의 질문</span>
        </h1>
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
        <div className="glass rounded-3xl p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
            <Clock className="w-10 h-10 text-primary" />
          </div>
          <p className="text-lg font-medium mb-2">오늘의 질문이 아직 없습니다</p>
          <p className="text-muted-foreground">자정에 새로운 질문이 도착합니다.</p>
        </div>
      )}

      {/* Group Answers */}
      {groups.length > 0 && dailyQuestion && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              그룹원들의 답변
            </h2>
            {!revealed && (
              <span className="text-xs text-muted-foreground px-3 py-1.5 rounded-full bg-secondary/50">
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
            <div className="glass rounded-3xl p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center">
                <span className="text-4xl">✉️</span>
              </div>
              <p className="text-lg font-medium mb-2">답변 공개 대기중</p>
              <p className="text-muted-foreground">
                그룹원들의 답변은<br />
                다음날 아침 9시에 공개됩니다
              </p>
            </div>
          )}
        </div>
      )}

      {/* No group prompt */}
      {groups.length === 0 && (
        <div className="glass rounded-3xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <p className="text-muted-foreground mb-4">
            아직 참여중인 그룹이 없어요
          </p>
          <a href="/group" className="text-primary hover:underline text-sm font-medium">
            그룹 만들기 →
          </a>
        </div>
      )}
    </div>
  )
}
