'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Sparkles, BookOpen, Users, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const navItems = [
  { href: '/today', icon: Sparkles, label: '오늘' },
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
      {/* Gradient border at top */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Nav content with glass effect */}
      <div className="bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            {navItems.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'relative flex flex-col items-center justify-center gap-1 px-5 py-2 rounded-2xl transition-all duration-300',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-lg shadow-primary/50" />
                  )}

                  <div className={cn(
                    'p-2 rounded-xl transition-all duration-300',
                    isActive && 'bg-primary/10'
                  )}>
                    <Icon className={cn(
                      'w-5 h-5 transition-transform duration-300',
                      isActive && 'scale-110'
                    )} />
                  </div>
                  <span className={cn(
                    'text-xs transition-all duration-300',
                    isActive ? 'font-semibold' : 'font-medium'
                  )}>
                    {label}
                  </span>
                </Link>
              )
            })}

            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center gap-1 px-5 py-2 rounded-2xl transition-all duration-300 text-muted-foreground hover:text-destructive"
            >
              <div className="p-2 rounded-xl transition-all duration-300 hover:bg-destructive/10">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">로그아웃</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
