import raw from './data/exercises.json'
import type { Exercise } from './db'

export const catalog = raw as Exercise[]
export const imageUrl = (path?: string) => path ? /^https:\/\//.test(path) ? path : `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${path}` : ''
export const muscleLabel: Record<string, string> = { abdominals:'Пресс', biceps:'Бицепс', triceps:'Трицепс', shoulders:'Плечи', chest:'Грудь', lats:'Спина', 'middle back':'Спина', 'lower back':'Спина', traps:'Спина', quadriceps:'Ноги', hamstrings:'Ноги', glutes:'Ягодицы', calves:'Ноги', forearms:'Руки', adductors:'Ноги', abductors:'Ноги', neck:'Шея' }
export const equipmentLabel: Record<string, string> = { 'body only':'Вес тела', dumbbell:'Гантели', barbell:'Штанга', machine:'Тренажёр', cable:'Блок', kettlebells:'Гиря', bands:'Резинки', 'pull-up bar':'Турник', 'exercise ball':'Фитбол', 'foam roll':'Ролик', other:'Другое', null:'Без оборудования', 'e-z curl bar':'EZ-гриф', 'medicine ball':'Медбол' }
export const levelLabel: Record<string,string> = { beginner:'Начальный', intermediate:'Средний', expert:'Продвинутый' }
export const ruNames: Record<string,string> = {
  'Air Bike':'Велосипед на пресс', 'Ab Crunch Machine':'Скручивания в тренажёре', 'Ab Roller':'Ролик для пресса', 'Alternate Hammer Curl':'Попеременные молотковые сгибания', 'Barbell Bench Press - Medium Grip':'Жим штанги лёжа', 'Bodyweight Squat':'Приседания с весом тела', 'Burpee':'Бёрпи', 'Dumbbell Bench Press':'Жим гантелей лёжа', 'Dumbbell Flyes':'Разведение гантелей лёжа', 'Front Dumbbell Raise':'Подъём гантелей перед собой', 'Pullups':'Подтягивания', 'Pushups':'Отжимания', 'Plank':'Планка', 'Mountain Climbers':'Альпинист', 'Jumping Jacks':'Прыжки с разведением рук и ног', 'Walking Lunge':'Выпады в шаге', 'Leg Press':'Жим ногами', 'Seated Cable Rows':'Тяга блока сидя', 'Standing Calf Raises':'Подъём на носки стоя', 'Step-up with Dumbbell':'Зашагивания с гантелями'
}
export function displayName(e: Exercise) { return ruNames[e.name] || e.name }
export function focusOf(e: Exercise) {
  const muscles = e.primaryMuscles.map(m => muscleLabel[m] || m)
  if (muscles.includes('Ноги') || muscles.includes('Ягодицы')) return 'Ноги'
  if (muscles.includes('Спина')) return 'Спина'
  if (muscles.includes('Пресс')) return 'Пресс'
  if (muscles.some(m => ['Бицепс','Трицепс','Руки'].includes(m))) return 'Руки'
  if (muscles.includes('Грудь')) return 'Грудь'
  return muscles[0] || 'Всё тело'
}
export function placeOf(e: Exercise) { return ['body only','dumbbell','kettlebells','bands','exercise ball','foam roll',null].includes(e.equipment) ? 'Дом' : 'Зал' }
