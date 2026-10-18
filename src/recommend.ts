import { catalog, equipmentLabel, focusOf, placeOf } from './catalog'
import type { AppData, Exercise, Plan, Session } from './db'

const levels: Record<string,number> = { beginner: 0, intermediate: 1, expert: 2, 'Начальный': 0, 'Средний': 1, 'Продвинутый': 2 }
export function recommendedFocus(data: AppData) {
  const recent = [...data.sessions].filter(s => s.status === 'done').sort((a,b) => b.date.localeCompare(a.date))[0]
  const lastFocus = data.plans.find(p => p.id === recent?.planId)?.focus
  return lastFocus === 'Ноги' ? 'Спина' : lastFocus === 'Спина' ? 'Руки' : lastFocus === 'Руки' ? 'Ноги' : 'Всё тело'
}
export function suitableExercises(data: AppData, exercises: Exercise[], focus: string, place: string) {
  const available = new Set([...data.profile.equipment, 'Вес тела', 'Без оборудования'])
  const maxLevel = levels[data.profile.level] ?? 0
  return exercises.filter(e => (focus === 'Всё тело' || focusOf(e) === focus) && (place === 'Зал' || placeOf(e) === 'Дом') && available.has(equipmentLabel[String(e.equipment)] || e.equipment || 'Без оборудования') && (levels[e.level] ?? 0) <= maxLevel)
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

const starterFocus: Record<number, string[]> = {
  1: ['Всё тело'],
  2: ['Всё тело', 'Всё тело'],
  3: ['Ноги', 'Спина', 'Всё тело'],
  4: ['Ноги', 'Спина', 'Руки', 'Всё тело'],
  5: ['Ноги', 'Спина', 'Руки', 'Пресс', 'Всё тело'],
  6: ['Ноги', 'Спина', 'Руки', 'Пресс', 'Грудь', 'Всё тело']
}
const starterExercises: Record<string, string[]> = {
  'Ноги': ['Bodyweight Squat','Bodyweight Walking Lunge','Butt Lift (Bridge)','Step-up with Knee Raise','Dumbbell Squat','Dumbbell Lunges','Stiff-Legged Dumbbell Deadlift','Leg Press'],
  'Спина': ['Bent Over Two-Dumbbell Row','One-Arm Dumbbell Row','Dumbbell Incline Row','Inverted Row','Bent Over Two-Dumbbell Row With Palms In','Seated Cable Rows'],
  'Руки': ['Alternate Hammer Curl','Body Tricep Press','Hammer Curls','Close-Grip Dumbbell Press','Standing Dumbbell Triceps Extension','Dips - Triceps Version'],
  'Пресс': ['Plank','Reverse Crunch','Bent-Knee Hip Raise','Air Bike','Crunches','Side Bridge'],
  'Грудь': ['Pushups','Incline Push-Up','Dumbbell Bench Press','Push-Up Wide','Incline Dumbbell Press'],
  'Всё тело': ['Bodyweight Squat','Pushups','Bent Over Two-Dumbbell Row','Butt Lift (Bridge)','Plank','Bodyweight Walking Lunge','One-Arm Dumbbell Row','Reverse Crunch']
}

export function makeStarterSchedule(data: AppData, exercises: Exercise[]): { plans: Plan[]; sessions: Session[] } {
  const count = Math.max(1, Math.min(6, Number(data.profile.days) || 3))
  const reps = data.profile.goal === 'Сила' ? 6 : data.profile.goal === 'Снижение веса' ? 15 : data.profile.goal === 'Набор мышц' ? 10 : 12
  const sets = data.profile.goal === 'Сила' ? 4 : 3
  const start = new Date()
  start.setHours(12, 0, 0, 0)
  start.setDate(start.getDate() + 1)
  const offsets = Array.from({ length: count }, (_, i) => Math.floor(i * 7 / count))
  const datesForWeek = (week: number) => offsets.map(offset => {
    const date = new Date(start)
    date.setDate(start.getDate() + week * 7 + offset)
    return date.toLocaleDateString('sv-SE')
  })
  let week = 0
  while (week < 52 && datesForWeek(week).some(date => data.sessions.some(s => s.date === date))) week++
  const dates = datesForWeek(week)
  const plans: Plan[] = []
  const sessions: Session[] = []
  starterFocus[count].forEach((requestedFocus, i) => {
    const place = data.profile.place === 'Зал и дом' ? (i % 2 ? 'Зал' : 'Дом') : data.profile.place
    const available = suitableExercises(data, exercises, 'Всё тело', place)
    const choose = (focus: string) => starterExercises[focus].map(name => available.find(e => e.name === name)).filter((e): e is Exercise => !!e).slice(0, 5)
    const focused = choose(requestedFocus)
    const focus = focused.length >= 3 ? requestedFocus : 'Всё тело'
    const picked = focus === requestedFocus ? focused : choose('Всё тело')
    if (!picked.length) return
    const plan: Plan = { id: crypto.randomUUID(), name: `${focus} · ${place.toLowerCase()}`, focus, place, items: picked.map(e => ({ exerciseId: e.id, sets, reps })), createdAt: new Date().toLocaleDateString('sv-SE') }
    plans.push(plan)
    sessions.push({ id: crypto.randomUUID(), date: dates[i], planId: plan.id, status: 'planned', note: '' })
  })
  return { plans, sessions }
}
