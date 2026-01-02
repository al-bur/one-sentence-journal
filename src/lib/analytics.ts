// GA4 Analytics utilities

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID

// Page view tracking (handled automatically by GA4)
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_ID, {
      page_path: url,
    })
  }
}

// Custom event tracking
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Predefined events for One Sentence Journal
export const analytics = {
  // Auth events
  signup: () => trackEvent('sign_up', 'auth'),
  login: (method: 'google' | 'email') => trackEvent('login', 'auth', method),

  // Core actions
  answerQuestion: () => trackEvent('answer_question', 'engagement'),
  viewTimeline: () => trackEvent('view_timeline', 'engagement'),

  // Group events
  createGroup: () => trackEvent('create_group', 'group'),
  joinGroup: () => trackEvent('join_group', 'group'),
  shareInviteCode: () => trackEvent('share_invite_code', 'group'),

  // Social
  viewGroupAnswers: () => trackEvent('view_group_answers', 'social'),
}
