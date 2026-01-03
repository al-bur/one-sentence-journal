'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Users, Copy, Crown, LogOut, ChevronRight, Pencil, Trash2, Check, X } from 'lucide-react'
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

export function GroupList({ groups: initialGroups, userId }: GroupListProps) {
  const [groups, setGroups] = useState(initialGroups)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const queryClient = useQueryClient()

  async function copyInviteCode(code: string) {
    try {
      await navigator.clipboard.writeText(code)
      toast.success('초대 코드가 복사되었습니다')
    } catch {
      toast.error('복사에 실패했습니다')
    }
  }

  // Leave group mutation
  const leaveMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const { error } = await supabase
        .from('journal_group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', userId)

      if (error) throw error
      return groupId
    },
    onMutate: async (groupId) => {
      const previousGroups = groups
      setGroups(prev => prev.filter(g => g.id !== groupId))
      setSelectedGroup(null)
      return { previousGroups }
    },
    onError: (error, groupId, context) => {
      console.error(error)
      setGroups(context?.previousGroups ?? [])
      toast.error('그룹 나가기에 실패했습니다')
    },
    onSuccess: () => {
      toast.success('그룹을 나갔습니다')
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      router.refresh()
    },
  })

  // Update group name mutation
  const updateNameMutation = useMutation({
    mutationFn: async ({ groupId, name }: { groupId: string; name: string }) => {
      const { error } = await supabase
        .from('journal_groups')
        .update({ name })
        .eq('id', groupId)

      if (error) throw error
      return { groupId, name }
    },
    onMutate: async ({ groupId, name }) => {
      const previousGroups = groups
      const previousSelectedGroup = selectedGroup

      setGroups(prev => prev.map(g => g.id === groupId ? { ...g, name } : g))
      setSelectedGroup(prev => prev ? { ...prev, name } : null)
      setIsEditing(false)

      return { previousGroups, previousSelectedGroup }
    },
    onError: (error, variables, context) => {
      console.error(error)
      setGroups(context?.previousGroups ?? [])
      setSelectedGroup(context?.previousSelectedGroup ?? null)
      setIsEditing(true)
      toast.error('이름 변경에 실패했습니다')
    },
    onSuccess: () => {
      toast.success('그룹 이름이 변경되었습니다')
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      router.refresh()
    },
  })

  // Delete group mutation
  const deleteMutation = useMutation({
    mutationFn: async (groupId: string) => {
      // Delete members first
      const { error: membersError } = await supabase
        .from('journal_group_members')
        .delete()
        .eq('group_id', groupId)

      if (membersError) throw membersError

      // Delete group
      const { error: groupError } = await supabase
        .from('journal_groups')
        .delete()
        .eq('id', groupId)

      if (groupError) throw groupError
      return groupId
    },
    onMutate: async (groupId) => {
      const previousGroups = groups
      setGroups(prev => prev.filter(g => g.id !== groupId))
      setSelectedGroup(null)
      setShowDeleteConfirm(false)
      return { previousGroups }
    },
    onError: (error, groupId, context) => {
      console.error(error)
      setGroups(context?.previousGroups ?? [])
      toast.error('그룹 삭제에 실패했습니다')
    },
    onSuccess: () => {
      toast.success('그룹이 삭제되었습니다')
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      router.refresh()
    },
  })

  function startEditing() {
    if (selectedGroup) {
      setEditName(selectedGroup.name)
      setIsEditing(true)
    }
  }

  function cancelEditing() {
    setIsEditing(false)
    setEditName('')
  }

  function handleUpdateName() {
    if (!editName.trim()) {
      toast.error('그룹 이름을 입력해주세요')
      return
    }
    if (selectedGroup) {
      updateNameMutation.mutate({ groupId: selectedGroup.id, name: editName.trim() })
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

      <Dialog open={!!selectedGroup} onOpenChange={(open) => {
        if (!open) {
          setSelectedGroup(null)
          setIsEditing(false)
          setShowDeleteConfirm(false)
        }
      }}>
        <DialogContent onClose={() => {
          setSelectedGroup(null)
          setIsEditing(false)
          setShowDeleteConfirm(false)
        }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isEditing ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="h-8"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdateName()
                      } else if (e.key === 'Escape') {
                        cancelEditing()
                      }
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                    onClick={handleUpdateName}
                    disabled={updateNameMutation.isPending}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-muted"
                    onClick={cancelEditing}
                    disabled={updateNameMutation.isPending}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  {selectedGroup?.name}
                  {selectedGroup?.isOwner && (
                    <>
                      <Crown className="w-4 h-4 text-accent" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-primary/10 hover:text-primary"
                        onClick={startEditing}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </>
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

            {selectedGroup?.isOwner ? (
              showDeleteConfirm ? (
                <div className="space-y-3">
                  <p className="text-sm text-center text-muted-foreground">
                    정말 그룹을 삭제하시겠습니까?<br />
                    <span className="text-destructive">모든 멤버가 그룹에서 제외됩니다.</span>
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={deleteMutation.isPending}
                    >
                      취소
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => selectedGroup && deleteMutation.mutate(selectedGroup.id)}
                      isLoading={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      삭제
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  그룹 삭제
                </Button>
              )
            ) : (
              <Button
                variant="outline"
                className="w-full text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => selectedGroup && leaveMutation.mutate(selectedGroup.id)}
                isLoading={leaveMutation.isPending}
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
