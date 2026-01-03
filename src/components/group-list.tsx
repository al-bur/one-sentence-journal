'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Users, Copy, Crown, LogOut, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Group {
  id: string
  name: string
  invite_code: string
  memberCount: number
  isOwner: boolean
  created_at: string
}

interface GroupListProps {
  groups: Group[]
  userId: string
}

export function GroupList({ groups, userId }: GroupListProps) {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [isLeaving, setIsLeaving] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function copyInviteCode(code: string) {
    try {
      await navigator.clipboard.writeText(code)
      toast.success('초대 코드가 복사되었습니다')
    } catch {
      toast.error('복사에 실패했습니다')
    }
  }

  async function leaveGroup(groupId: string) {
    setIsLeaving(true)
    try {
      const { error } = await supabase
        .from('journal_group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId)

      if (error) throw error

      toast.success('그룹을 나갔습니다')
      setSelectedGroup(null)
      router.refresh()
    } catch {
      toast.error('그룹 나가기에 실패했습니다')
    } finally {
      setIsLeaving(false)
    }
  }

  if (groups.length === 0) {
    return (
      <div className="glass rounded-3xl p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-accent/20 to-primary/10 flex items-center justify-center">
          <Users className="w-10 h-10 text-accent" />
        </div>
        <p className="text-lg font-medium mb-2">아직 참여중인 그룹이 없어요</p>
        <p className="text-muted-foreground">
          새 그룹을 만들거나 초대 코드로 참여하세요
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {groups.map((group, index) => (
          <div
            key={group.id}
            className="glass rounded-2xl p-4 cursor-pointer card-hover animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => setSelectedGroup(group)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{group.name}</h3>
                    {group.isOwner && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                        <Crown className="w-3 h-3" />
                        관리자
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {group.memberCount}명 참여중
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedGroup} onOpenChange={() => setSelectedGroup(null)}>
        <DialogContent onClose={() => setSelectedGroup(null)}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedGroup?.name}
              {selectedGroup?.isOwner && (
                <Crown className="w-4 h-4 text-accent" />
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedGroup?.memberCount}명 참여중
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/50 to-secondary/30 border border-border/30">
              <p className="text-xs text-muted-foreground mb-2">초대 코드</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl tracking-[0.3em] text-primary font-semibold">
                  {selectedGroup?.invite_code}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 hover:text-primary"
                  onClick={() => selectedGroup && copyInviteCode(selectedGroup.invite_code)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!selectedGroup?.isOwner && (
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => selectedGroup && leaveGroup(selectedGroup.id)}
                isLoading={isLeaving}
              >
                <LogOut className="w-4 h-4 mr-2" />
                그룹 나가기
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
