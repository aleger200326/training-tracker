import type { Plan } from './db'

export const planPhotos = [
  '/images/stat-workouts.png',
  '/images/stat-completed.png',
  '/images/stat-missed.png',
  '/images/stat-goal.png',
  '/images/plans-pullup.png',
  '/images/dashboard-next.png',
  '/images/dashboard-stats.png',
  '/images/dashboard-week.png',
  '/images/dashboard-recommendation.png',
  '/images/georgrad-training-hero.png'
] as const

export function assignPlanPhotos(existing: Plan[], incoming: Plan[]): Plan[] {
  const start = Math.max(existing.length - 1, ...existing.map(plan => plan.photoIndex ?? -1)) + 1
  return incoming.map((plan, index) => ({ ...plan, photoIndex: start + index }))
}

export function planPhoto(plan: Plan, fallbackIndex: number): string {
  const index = plan.photoIndex ?? fallbackIndex
  return planPhotos[((index % planPhotos.length) + planPhotos.length) % planPhotos.length]
}
