import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Vercel Cron에서 호출될 API
// cron: 0 0 * * * (매일 자정 UTC)
// 한국 시간 기준 자정은 UTC 15:00

export async function GET(request: Request) {
  // Cron secret 검증
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // 오늘 날짜 (KST 기준)
    const now = new Date()
    const kstOffset = 9 * 60 * 60 * 1000
    const kstDate = new Date(now.getTime() + kstOffset)
    const todayStr = kstDate.toISOString().split('T')[0]

    // 오늘 질문이 이미 있는지 확인
    const { data: existing } = await supabase
      .from('journal_daily_questions')
      .select('id')
      .eq('question_date', todayStr)
      .single()

    if (existing) {
      return NextResponse.json({ message: 'Daily question already exists', question_date: todayStr })
    }

    // 최근 30일 동안 사용된 질문 제외하고 랜덤 선택
    const thirtyDaysAgo = new Date(kstDate.getTime() - 30 * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0]

    const { data: recentQuestions } = await supabase
      .from('journal_daily_questions')
      .select('question_id')
      .gte('question_date', thirtyDaysAgo)

    const recentIds = recentQuestions?.map(q => q.question_id) || []

    // 사용 가능한 질문 중 랜덤 선택
    let query = supabase
      .from('journal_questions')
      .select('id')

    if (recentIds.length > 0) {
      query = query.not('id', 'in', `(${recentIds.join(',')})`)
    }

    const { data: availableQuestions } = await query

    if (!availableQuestions || availableQuestions.length === 0) {
      // 모든 질문이 사용됨, 아무거나 선택
      const { data: anyQuestion } = await supabase
        .from('journal_questions')
        .select('id')
        .limit(1)
        .single()

      if (!anyQuestion) {
        return NextResponse.json({ error: 'No questions available' }, { status: 500 })
      }

      const { error } = await supabase
        .from('journal_daily_questions')
        .insert({
          question_date: todayStr,
          question_id: anyQuestion.id,
        })

      if (error) throw error

      return NextResponse.json({ success: true, question_date: todayStr, question_id: anyQuestion.id })
    }

    // 랜덤 선택
    const randomIndex = Math.floor(Math.random() * availableQuestions.length)
    const selectedQuestion = availableQuestions[randomIndex]

    const { error } = await supabase
      .from('journal_daily_questions')
      .insert({
        question_date: todayStr,
        question_id: selectedQuestion.id,
      })

    if (error) throw error

    return NextResponse.json({ success: true, question_date: todayStr, question_id: selectedQuestion.id })
  } catch (error) {
    console.error('Cron error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
