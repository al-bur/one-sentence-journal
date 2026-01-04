'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { getTimeUntilDeadline } from '@/lib/utils'
import { Send, Edit2, Check } from 'lucide-react'

interface Answer {
  id: string
  content: string
}

interface TodayQuestionProps {
  question: {
    id: string
    content: string
    category: string
  }
  dailyQuestionId: string
  myAnswer: Answer | null
  userId: string
}

export function TodayQuestion({
  question,
  dailyQuestionId,
  myAnswer: initialAnswer,
  userId,
}: TodayQuestionProps) {
  const [answer, setAnswer] = useState(initialAnswer?.content || '')
  const [isEditing, setIsEditing] = useState(!initialAnswer)
  const [savedAnswer, setSavedAnswer] = useState<Answer | null>(initialAnswer)
  const supabase = createClient()
  const queryClient = useQueryClient()

  const maxLength = 100

  const submitMutation = useMutation({
    mutationFn: async (content: string) => {
      if (savedAnswer) {
        // Update existing answer
        const { error } = await supabase
          .from('journal_answers')
          .update({ content })
          .eq('id', savedAnswer.id)

        if (error) throw error
        return { ...savedAnswer, content }
      } else {
        // Create new answer
        const { data, error } = await supabase
          .from('journal_answers')
          .insert({
            daily_question_id: dailyQuestionId,
            user_id: userId,
            content,
          })
          .select()
          .single()

        if (error) throw error
        return data as Answer
      }
    },
    onMutate: async (content) => {
      // Optimistic update
      const previousAnswer = savedAnswer

      if (savedAnswer) {
        setSavedAnswer({ ...savedAnswer, content })
      } else {
        setSavedAnswer({ id: 'temp-id', content })
      }
      setIsEditing(false)

      return { previousAnswer }
    },
    onError: (error, content, context) => {
      // Rollback on error
      console.error(error)
      setSavedAnswer(context?.previousAnswer ?? null)
      setIsEditing(true)
      toast.error('저장 중 오류가 발생했습니다')
    },
    onSuccess: (data) => {
      setSavedAnswer(data)
      toast.success(savedAnswer ? '답변이 수정되었습니다' : '답변이 저장되었습니다')
      queryClient.invalidateQueries({ queryKey: ['answers'] })
    },
  })

  function handleSubmit() {
    if (!answer.trim()) {
      toast.error('답변을 입력해주세요')
      return
    }

    if (answer.length > maxLength) {
      toast.error(`${maxLength}자 이내로 작성해주세요`)
      return
    }

    submitMutation.mutate(answer.trim())
  }

  return (
    <div className="card-elevated overflow-hidden">
      {/* Top accent */}
      <div className="h-1 bg-primary" />

      <div className="p-8 space-y-8">
        {/* Question */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
            {question.category}
          </div>
          <p className="text-2xl md:text-3xl font-semibold leading-relaxed tracking-tight">
            {question.content}
          </p>
        </div>

        {/* Answer */}
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="한 문장으로 답변해주세요..."
              className="min-h-[120px] bg-secondary/50 border-border rounded-xl text-lg placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary/20"
              maxLength={maxLength}
            />
            <div className="flex items-center justify-between">
              <span className={`text-sm ${answer.length > maxLength ? 'text-destructive' : 'text-muted-foreground'}`}>
                {answer.length}/{maxLength}
              </span>
              <div className="flex items-center gap-3">
                {savedAnswer && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setAnswer(savedAnswer.content)
                      setIsEditing(false)
                    }}
                    className="text-muted-foreground"
                  >
                    취소
                  </Button>
                )}
                <Button
                  onClick={handleSubmit}
                  isLoading={submitMutation.isPending}
                  className="rounded-xl px-6"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {savedAnswer ? '수정' : '보내기'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-secondary border border-border">
              <p className="text-lg leading-relaxed">{savedAnswer?.content}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-primary">
                <Check className="w-4 h-4" />
                답변 완료
              </div>
              <Button
                variant="ghost"
                onClick={() => setIsEditing(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                수정
              </Button>
            </div>
          </div>
        )}

        {/* Deadline */}
        <p className="text-sm text-center text-muted-foreground">
          마감까지 <span className="text-primary font-medium">{getTimeUntilDeadline()}</span> 남음
        </p>
      </div>
    </div>
  )
}
