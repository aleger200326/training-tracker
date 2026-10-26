import { openDB } from 'idb'

export type Profile = { name: string; height: string; weight: string; goal: string; level: string; place: string; days: string; equipment: string[] }
export type Exercise = { id: string; name: string; level: string; equipment: string; primaryMuscles: string[]; secondaryMuscles: string[]; instructions: string[]; images: string[]; category: string; custom?: boolean }
export type PlanItem = { exerciseId: string; sets: number; reps: number }
export type Plan = { id: string; name: string; focus: string; place: string; items: PlanItem[]; createdAt: string; photoIndex?: number }
export type Session = { id: string; date: string; planId: string; status: 'planned' | 'done' | 'missed'; note: string }
export type AppData = { profile: Profile; customExercises: Exercise[]; plans: Plan[]; sessions: Session[] }

export const initialData: AppData = {
  profile: { name: '', height: '', weight: '', goal: 'Набор мышц', level: 'Начальный', place: 'Зал и дом', days: '3', equipment: ['Вес тела', 'Гантели'] },
  customExercises: [], plans: [], sessions: []
}

const dbPromise = openDB('atletika-v1', 1, { upgrade(db) { db.createObjectStore('app') } })
export async function loadData(): Promise<AppData> {
  const db = await dbPromise
  const saved = await db.get('app', 'data') as AppData | undefined
  return saved ? { ...initialData, ...saved, profile: { ...initialData.profile, ...saved.profile } } : initialData
}
export async function saveData(data: AppData) { const db = await dbPromise; await db.put('app', data, 'data') }
export function validImport(value: unknown): value is AppData {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return !!v.profile && typeof v.profile === 'object' && Array.isArray(v.plans) && Array.isArray(v.sessions) && Array.isArray(v.customExercises) && v.plans.every((p: any) => typeof p.id === 'string' && typeof p.name === 'string' && Array.isArray(p.items)) && v.sessions.every((s: any) => typeof s.id === 'string' && typeof s.date === 'string' && ['planned','done','missed'].includes(s.status)) && v.customExercises.every((e: any) => typeof e.id === 'string' && typeof e.name === 'string')
}
