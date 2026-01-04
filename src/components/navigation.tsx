'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { PenLine, BookOpen, Users, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const navItems = [
  { href: '/today', icon: PenLine, label: '오늘' },
  { href: '/timeline', icon: BookOpen, label: '타임라인' },
  { href: '/group', icon: Users, label: '그룹' },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('로그아웃 실패: ' + error.message)
    } else {
      toast.success('로그아웃되었습니다')
      router.push('/')
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb">
      {/* Clean border */}
      <div className="h-[1px] bg-border" />

      {/* Nav content */}
      <div className="bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 px-5 py-2 transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className={cn(
                    'w-5 h-5',
                    isActive && 'stroke-[2.5]'
                  )} />
                  <span className={cn(
                    'text-xs',
                    isActive ? 'font-semibold' : 'font-medium'
                  )}>
                    {label}
                  </span>
                </Link>
              )
            })}

            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center gap-1 px-5 py-2 transition-colors text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-xs font-medium">로그아웃</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
