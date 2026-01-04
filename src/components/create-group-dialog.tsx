'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Plus, Copy } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CreateGroupDialogProps {
  userId: string
}

function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function CreateGroupDialog({ userId }: CreateGroupDialogProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [createdGroup, setCreatedGroup] = useState<{ name: string; invite_code: string } | null>(null)
  const supabase = createClient()
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setIsLoading(true)

    try {
      // 초대 코드 생성
      const inviteCode = generateInviteCode()

      // 그룹 생성
      const { data: group, error: groupError } = await supabase
        .from('journal_groups')
        .insert({
          name: name.trim(),
          invite_code: inviteCode,
          created_by: userId,
        })
        .select()
        .single()

      if (groupError) throw groupError

      // 생성자를 멤버로 추가
      const { error: memberError } = await supabase
        .from('journal_group_members')
        .insert({
          group_id: group.id,
          user_id: userId,
        })

      if (memberError) throw memberError

      setCreatedGroup({ name: group.name, invite_code: group.invite_code })
      setStep('success')
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('그룹 생성에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  async function copyInviteCode() {
    if (!createdGroup) return
    try {
      await navigator.clipboard.writeText(createdGroup.invite_code)
      toast.success('초대 코드가 복사되었습니다')
    } catch {
      toast.error('복사에 실패했습니다')
    }
  }

  function handleClose() {
    setOpen(false)
    setTimeout(() => {
      setStep('form')
      setName('')
      setCreatedGroup(null)
    }, 200)
  }

  return (
    <>
      <Button className="flex-1" onClick={() => setOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        그룹 만들기
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent onClose={handleClose}>
          {step === 'form' ? (
            <>
              <DialogHeader>
                <DialogTitle>새 그룹 만들기</DialogTitle>
                <DialogDescription>
                  소중한 사람들과 함께할 그룹을 만들어요
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    그룹 이름
                  </label>
                  <Input
                    id="name"
                    placeholder="예: 우리 가족"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={20}
                  />
                </div>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  그룹 만들기
                </Button>
              </form>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>그룹이 생성되었습니다!</DialogTitle>
                <DialogDescription>
                  초대 코드를 공유해서 멤버를 초대하세요
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-6 rounded-xl bg-secondary border border-border text-center">
                  <p className="text-xs text-muted-foreground mb-3">초대 코드</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-mono text-3xl tracking-[0.3em] text-primary font-semibold">
                      {createdGroup?.invite_code}
                    </span>
                    <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" onClick={copyInviteCode}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <Button className="w-full" onClick={handleClose}>
                  완료
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
