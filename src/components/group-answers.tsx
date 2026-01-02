'use client'

import { useEffect, useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'

interface GroupAnswersProps {
  dailyQuestionId: string
  userId: string
  groups: { id: string; name: string }[]
}

interface Answer {
  id: string
  content: string
  created_at: string
  user_id: string
  user_name: string
  user_avatar: string | null
}

export function GroupAnswers({ dailyQuestionId, userId, groups }: GroupAnswersProps) {
  const [answers, setAnswers] = useState<Answer[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchAnswers() {
      // 그룹 멤버들의 ID 가져오기
      const groupIds = groups.map(g => g.id)

      const { data: members } = await supabase
        .from('journal_group_members')
        .select('user_id')
        .in('group_id', groupIds)

      if (!members) {
        setLoading(false)
        return
      }

      const memberIds = [...new Set(members.map(m => m.user_id))]

      // 그룹 멤버들의 답변 가져오기 (본인 제외)
      const { data: answersData } = await supabase
        .from('journal_answers')
        .select('*')
        .eq('daily_question_id', dailyQuestionId)
        .in('user_id', memberIds)
        .neq('user_id', userId)

      if (answersData) {
        // 사용자 정보 가져오기
        const { data: users } = await supabase.auth.admin?.listUsers()
        // Note: admin API가 없으므로 profiles 테이블을 사용하거나 답변에 이름을 저장해야 함
        // 임시로 user_id를 이름으로 사용

        setAnswers(answersData.map(a => ({
          id: a.id,
          content: a.content,
          created_at: a.created_at || new Date().toISOString(),
          user_id: a.user_id || '',
          user_name: '익명',
          user_avatar: null,
        })))
      }

      setLoading(false)
    }

    fetchAnswers()
  }, [dailyQuestionId, userId, groups, supabase])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (answers.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-card border border-border text-center">
        <p className="text-muted-foreground">
          아직 답변한 그룹원이 없어요
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {answers.map(answer => (
        <div
          key={answer.id}
          className="p-4 rounded-2xl bg-card border border-border animate-fade-in"
        >
          <div className="flex items-start gap-3">
            <Avatar
              src={answer.user_avatar}
              alt={answer.user_name}
              fallback={answer.user_name}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{answer.user_name}</p>
              <p className="mt-2 text-foreground leading-relaxed">
                {answer.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
