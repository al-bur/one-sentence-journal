import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 답변 공개 시간 체크 (오전 9시 이후)
export function isAnswerRevealed(questionDate: string): boolean {
  const today = new Date()
  const qDate = new Date(questionDate)

  // 어제 이전 질문은 항상 공개
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (qDate < yesterday) return true

  // 오늘 질문은 9시 이후에만 공개
  if (qDate.toDateString() === today.toDateString()) {
    return today.getHours() >= 9
  }

  // 어제 질문은 오늘 9시 이후에만 공개
  if (qDate.toDateString() === yesterday.toDateString()) {
    return today.getHours() >= 9
  }

  return false
}

// 답변 마감까지 남은 시간 계산
export function getTimeUntilDeadline(): string {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setDate(midnight.getDate() + 1)
  midnight.setHours(0, 0, 0, 0)

  const diff = midnight.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}시간 ${minutes}분`
  }
  return `${minutes}분`
}

// 공개까지 남은 시간 계산
export function getTimeUntilReveal(): string {
  const now = new Date()
  const revealTime = new Date(now)
  revealTime.setDate(revealTime.getDate() + 1)
  revealTime.setHours(9, 0, 0, 0)

  const diff = revealTime.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}시간 ${minutes}분`
  }
  return `${minutes}분`
}

// 날짜 포맷팅
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()

  const weekdays = ['일', '월', '화', '수', '목', '금', '토']
  const weekday = weekdays[d.getDay()]

  return `${year}년 ${month}월 ${day}일 (${weekday})`
}
