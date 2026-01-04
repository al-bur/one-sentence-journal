import { createClient } from '@/lib/supabase/server'
import { GroupList } from '@/components/group-list'
import { CreateGroupDialog } from '@/components/create-group-dialog'
import { JoinGroupDialog } from '@/components/join-group-dialog'
import { Users } from 'lucide-react'

export const metadata = {
  title: '그룹',
}

interface GroupMembershipWithGroup {
  id: string
  joined_at: string | null
  journal_groups: {
    id: string
    name: string
    invite_code: string
    created_by: string | null
    created_at: string | null
  } | null
}

export default async function GroupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // 내 그룹 가져오기
  const { data: myGroupMemberships } = await supabase
    .from('journal_group_members')
    .select(`
      id,
      joined_at,
      journal_groups (
        id,
        name,
        invite_code,
        created_by,
        created_at
      )
    `)
    .eq('user_id', user.id)

  const memberships = (myGroupMemberships || []) as GroupMembershipWithGroup[]

  const groups = memberships
    .filter(m => m.journal_groups !== null)
    .map(m => ({
      ...m.journal_groups!,
      membershipId: m.id,
      joinedAt: m.joined_at,
    }))

  // 각 그룹의 멤버 수 가져오기
  const groupsWithMembers = await Promise.all(
    groups.map(async (group) => {
      const { count } = await supabase
        .from('journal_group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', group.id)

      return {
        ...group,
        memberCount: count || 0,
        isOwner: group.created_by === user.id,
      }
    })
  )

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-2">
          <Users className="w-3 h-3" />
          {groupsWithMembers.length}개의 그룹
        </div>
        <h1 className="text-2xl font-bold">그룹</h1>
        <p className="text-muted-foreground">소중한 사람들과 함께해요</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <CreateGroupDialog userId={user.id} />
        <JoinGroupDialog userId={user.id} />
      </div>

      <GroupList
        groups={groupsWithMembers.map(g => ({
          id: g.id,
          name: g.name,
          invite_code: g.invite_code,
          memberCount: g.memberCount,
          isOwner: g.isOwner,
          created_at: g.created_at || '',
        }))}
        userId={user.id}
      />
    </div>
  )
}
