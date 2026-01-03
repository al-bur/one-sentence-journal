'use client'

import { useEffect, useState } from 'react'
import { Avatar } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { MessageCircle } from 'lucide-react'

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
          <div key={i} className="glass rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <Skeleton className="w-12 h-12 rounded-2xl" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (answers.length === 0) {
    return (
      <div className="glass rounded-3xl p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
          <MessageCircle className="w-8 h-8 text-primary" />
        </div>
        <p className="text-muted-foreground">
          아직 답변한 그룹원이 없어요
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {answers.map((answer, index) => (
        <div
          key={answer.id}
          className="glass rounded-2xl p-5 animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-start gap-4">
            <Avatar
              src={answer.user_avatar}
              alt={answer.user_name}
              fallback={answer.user_name}
              size="md"
              className="w-12 h-12 rounded-2xl border-2 border-primary/20"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm mb-3">{answer.user_name}</p>
              <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border/30">
                <p className="text-foreground leading-relaxed">
                  {answer.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
