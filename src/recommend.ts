import { catalog, equipmentLabel, focusOf, placeOf } from './catalog'
import type { AppData, Exercise, Plan } from './db'

const levels: Record<string,number> = { beginner: 0, intermediate: 1, expert: 2, 'Начальный': 0, 'Средний': 1, 'Продвинутый': 2 }
export function recommendedFocus(data: AppData) {
  const recent = [...data.sessions].filter(s => s.status === 'done').sort((a,b) => b.date.localeCompare(a.date))[0]
  const lastFocus = data.plans.find(p => p.id === recent?.planId)?.focus
  return lastFocus === 'Ноги' ? 'Спина' : lastFocus === 'Спина' ? 'Руки' : lastFocus === 'Руки' ? 'Ноги' : 'Всё тело'
}
export function suitableExercises(data: AppData, exercises: Exercise[], focus: string, place: string) {
  const available = new Set([...data.profile.equipment, 'Вес тела', 'Без оборудования'])
  const maxLevel = levels[data.profile.level] ?? 0
  return exercises.filter(e => (focus === 'Всё тело' || focusOf(e) === focus) && (place === 'Зал' || placeOf(e) === 'Дом') && (place === 'Зал' || available.has(equipmentLabel[String(e.equipment)] || e.equipment || 'Без оборудования')) && (levels[e.level] ?? 0) <= maxLevel)
}
export function makeRecommendedPlan(data: AppData): Plan {
  const focus = recommendedFocus(data)
  const place = data.profile.place === 'Дом' ? 'Дом' : 'Зал'
  const matched = suitableExercises(data, catalog, focus, place)
  const priority = ['Bodyweight Squat','Pushups','Pullups','Dumbbell Bench Press','Air Bike','Walking Lunge','Dumbbell Squat','Seated Cable Rows','Alternate Hammer Curl']
  const picked = [...matched].sort((a,b) => {
    const ai = priority.indexOf(a.name), bi = priority.indexOf(b.name)
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi)
  }).slice(0,5)
  return { id: crypto.randomUUID(), name: focus === 'Всё тело' ? `Базовая тренировка · ${place.toLowerCase()}` : `${focus} · ${place.toLowerCase()}`, focus, place, items: picked.map(e => ({ exerciseId:e.id, sets:3, reps: data.profile.goal === 'Сила' ? 6 : 12 })), createdAt:new Date().toLocaleDateString('sv-SE') }
}
