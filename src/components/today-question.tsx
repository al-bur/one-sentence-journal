'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { getTimeUntilDeadline } from '@/lib/utils'
import { Send, Edit2, Check } from 'lucide-react'

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
        // 수정
        const { error } = await supabase
          .from('journal_answers')
          .update({ content: answer.trim() })
          .eq('id', savedAnswer.id)

        if (error) throw error

        setSavedAnswer({ ...savedAnswer, content: answer.trim() })
        toast.success('답변이 수정되었습니다')
      } else {
        // 새로 작성
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
    <Card className="overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-primary to-accent" />
      <CardContent className="pt-6 space-y-6">
        {/* Question */}
        <div className="text-center">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            {question.category}
          </span>
          <p className="text-xl font-medium mt-2 leading-relaxed">
            {question.content}
          </p>
        </div>

        {/* Answer */}
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="한 문장으로 답변해주세요..."
              className="min-h-[100px]"
              maxLength={maxLength}
            />
            <div className="flex items-center justify-between">
              <span className={`text-xs ${answer.length > maxLength ? 'text-destructive' : 'text-muted-foreground'}`}>
                {answer.length}/{maxLength}
              </span>
              <div className="flex items-center gap-2">
                {savedAnswer && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAnswer(savedAnswer.content)
                      setIsEditing(false)
                    }}
                  >
                    취소
                  </Button>
                )}
                <Button
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  size="sm"
                >
                  <Send className="w-4 h-4 mr-1" />
                  {savedAnswer ? '수정' : '보내기'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <p className="text-foreground leading-relaxed">{savedAnswer?.content}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="w-4 h-4 text-green-500" />
                답변 완료
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="w-4 h-4 mr-1" />
                수정
              </Button>
            </div>
          </div>
        )}

        {/* Deadline */}
        <p className="text-xs text-center text-muted-foreground">
          마감까지 {getTimeUntilDeadline()} 남음
        </p>
      </CardContent>
    </Card>
  )
}
