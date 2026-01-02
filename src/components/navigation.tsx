'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Moon, Clock, Users, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const navItems = [
  { href: '/today', icon: Moon, label: '오늘' },
  { href: '/timeline', icon: Clock, label: '타임라인' },
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
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border safe-area-pb">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive && 'animate-float')} />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            )
          })}
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 text-muted-foreground hover:text-red-400"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs font-medium">로그아웃</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
