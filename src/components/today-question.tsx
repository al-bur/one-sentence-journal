'use client'

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { getTimeUntilDeadline } from '@/lib/utils'
import { Send, Edit2, Check, Sparkles } from 'lucide-react'

interface TodayQuestionProps {
  question: {
    id: string
    content: string
    category: string
  }
  dailyQuestionId: string
  myAnswer: {
    id: string
    content: string
  } | null
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
  const [isLoading, setIsLoading] = useState(false)
  const [savedAnswer, setSavedAnswer] = useState(initialAnswer)
  const supabase = createClient()

  const maxLength = 100

  async function handleSubmit() {
    if (!answer.trim()) {
      toast.error('답변을 입력해주세요')
      return
    }

    if (answer.length > maxLength) {
      toast.error(`${maxLength}자 이내로 작성해주세요`)
      return
    }

    setIsLoading(true)

    try {
      if (savedAnswer) {
        const { error } = await supabase
          .from('journal_answers')
          .update({ content: answer.trim() })
          .eq('id', savedAnswer.id)

        if (error) throw error

        setSavedAnswer({ ...savedAnswer, content: answer.trim() })
        toast.success('답변이 수정되었습니다')
      } else {
        const { data, error } = await supabase
          .from('journal_answers')
          .insert({
            daily_question_id: dailyQuestionId,
            user_id: userId,
            content: answer.trim(),
          })
          .select()
          .single()

        if (error) throw error

        setSavedAnswer(data)
        toast.success('답변이 저장되었습니다')
      }

      setIsEditing(false)
    } catch (error) {
      console.error(error)
      toast.error('저장 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="glass rounded-3xl overflow-hidden subtle-glow">
      {/* Gradient top bar */}
      <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />

      <div className="p-8 space-y-8">
        {/* Question */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
            <Sparkles className="w-3 h-3" />
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
              className="min-h-[120px] bg-secondary/30 border-border/50 rounded-2xl text-lg placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-primary/20"
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
                  isLoading={isLoading}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90 rounded-xl px-6"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {savedAnswer ? '수정' : '보내기'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border/30">
              <p className="text-lg leading-relaxed">{savedAnswer?.content}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-green-400">
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
