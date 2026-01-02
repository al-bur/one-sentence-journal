'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Users, Copy, Crown, LogOut } from 'lucide-react'
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
      <div className="p-12 rounded-2xl bg-card border border-border text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
          <Users className="w-8 h-8 text-accent" />
        </div>
        <p className="text-muted-foreground mb-2">
          아직 참여중인 그룹이 없어요
        </p>
        <p className="text-muted-foreground text-sm">
          새 그룹을 만들거나 초대 코드로 참여하세요
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {groups.map((group) => (
          <Card
            key={group.id}
            className="cursor-pointer card-hover"
            onClick={() => setSelectedGroup(group)}
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{group.name}</h3>
                      {group.isOwner && (
                        <Crown className="w-4 h-4 text-accent" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {group.memberCount}명 참여중
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
            <div className="p-4 rounded-xl bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-2">초대 코드</p>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl tracking-widest">
                  {selectedGroup?.invite_code}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => selectedGroup && copyInviteCode(selectedGroup.invite_code)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!selectedGroup?.isOwner && (
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive"
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
