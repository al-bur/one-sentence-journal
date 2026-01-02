'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { UserPlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface JoinGroupDialogProps {
  userId: string
}

export function JoinGroupDialog({ userId }: JoinGroupDialogProps) {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmedCode = code.trim().toUpperCase()
    if (!trimmedCode || trimmedCode.length !== 6) {
      toast.error('6자리 초대 코드를 입력해주세요')
      return
    }

    setIsLoading(true)

    try {
      // 그룹 찾기
      const { data: group, error: groupError } = await supabase
        .from('journal_groups')
        .select('id, name')
        .eq('invite_code', trimmedCode)
        .single()

      if (groupError || !group) {
        toast.error('유효하지 않은 초대 코드입니다')
        return
      }

      // 이미 멤버인지 확인
      const { data: existing } = await supabase
        .from('journal_group_members')
        .select('id')
        .eq('group_id', group.id)
        .eq('user_id', userId)
        .single()

      if (existing) {
        toast.error('이미 참여중인 그룹입니다')
        return
      }

      // 멤버로 추가
      const { error: memberError } = await supabase
        .from('journal_group_members')
        .insert({
          group_id: group.id,
          user_id: userId,
        })

      if (memberError) throw memberError

      toast.success(`'${group.name}' 그룹에 참여했습니다!`)
      setOpen(false)
      setCode('')
      router.refresh()
    } catch {
      toast.error('그룹 참여에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button variant="outline" className="flex-1" onClick={() => setOpen(true)}>
        <UserPlus className="w-4 h-4 mr-2" />
        초대 코드 입력
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClose={() => setOpen(false)}>
          <DialogHeader>
            <DialogTitle>그룹 참여하기</DialogTitle>
            <DialogDescription>
              초대 코드를 입력해서 그룹에 참여하세요
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">
                초대 코드
              </label>
              <Input
                id="code"
                placeholder="ABC123"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="text-center font-mono text-xl tracking-widest"
                required
              />
            </div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              참여하기
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
