import raw from './data/exercises.json'
import ru from './data/translations-ru.json'
import uz from './data/translations-uz.json'
import type { Exercise } from './db'
import { getUiLanguage } from './i18n'

export const catalog: Exercise[] = [...(raw as Exercise[]), { id:'atletika-stepper', name:'Зашагивания на степпер', level:'beginner', equipment:'stepper', primaryMuscles:['quadriceps'], secondaryMuscles:['glutes','calves'], instructions:['Поставьте степпер на устойчивую ровную поверхность.','Встаньте перед платформой и поставьте на неё одну стопу целиком.','Поднимитесь, выпрямляя опорную ногу, затем контролируемо спуститесь.','Повторите нужное число раз и смените ногу.'], images:[], category:'cardio' }]
export const imageUrl = (path?: string) => path ? /^https:\/\//.test(path) ? path : `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${path}` : ''
export const muscleLabel: Record<string, string> = { abdominals:'Пресс', biceps:'Бицепс', triceps:'Трицепс', shoulders:'Плечи', chest:'Грудь', lats:'Спина', 'middle back':'Спина', 'lower back':'Спина', traps:'Спина', quadriceps:'Ноги', hamstrings:'Ноги', glutes:'Ягодицы', calves:'Ноги', forearms:'Руки', adductors:'Ноги', abductors:'Ноги', neck:'Шея' }
export const equipmentLabel: Record<string, string> = { 'body only':'Вес тела', dumbbell:'Гантели', barbell:'Штанга', machine:'Тренажёр', cable:'Блок', kettlebells:'Гиря', bands:'Резинки', stepper:'Степпер', 'pull-up bar':'Турник', 'exercise ball':'Фитбол', 'foam roll':'Ролик', other:'Другое', null:'Без оборудования', 'e-z curl bar':'EZ-гриф', 'medicine ball':'Медбол' }
export const levelLabel: Record<string,string> = { beginner:'Начальный', intermediate:'Средний', expert:'Продвинутый' }
export const ruNames: Record<string,string> = {
  '3/4 Sit-Up':'Скручивания с неполной амплитудой',
  '90/90 Hamstring':'Растяжка задней поверхности бедра 90/90', 'Adductor/Groin':'Растяжка приводящих мышц и паха', 'Alternating Hang Clean':'Попеременный подъём гири на грудь', 'Alternating Renegade Row':'Попеременная тяга гири в упоре', 'Anti-Gravity Press':'Жим штанги над головой с отклонением',
  'Air Bike':'Велосипед на пресс', 'Ab Crunch Machine':'Скручивания в тренажёре', 'Ab Roller':'Ролик для пресса', 'Alternate Hammer Curl':'Попеременные молотковые сгибания', 'Barbell Bench Press - Medium Grip':'Жим штанги лёжа', 'Bodyweight Squat':'Приседания с весом тела', 'Burpee':'Бёрпи', 'Dumbbell Bench Press':'Жим гантелей лёжа', 'Dumbbell Flyes':'Разведение гантелей лёжа', 'Front Dumbbell Raise':'Подъём гантелей перед собой', 'Pullups':'Подтягивания', 'Pushups':'Отжимания', 'Plank':'Планка', 'Mountain Climbers':'Альпинист', 'Jumping Jacks':'Прыжки с разведением рук и ног', 'Walking Lunge':'Выпады в шаге', 'Leg Press':'Жим ногами', 'Seated Cable Rows':'Тяга блока сидя', 'Standing Calf Raises':'Подъём на носки стоя', 'Step-up with Dumbbell':'Зашагивания с гантелями'
}
type Translation = { name: string; instructions: string[] }
const ruTranslations = ru as Record<string, Translation>
const uzTranslations = uz as Record<string, Translation>
export function displayName(e: Exercise) {
  const lang = getUiLanguage()
  if (e.id === 'atletika-stepper') return lang === 'en' ? 'Stepper step-ups' : lang === 'uz' ? 'Stepperga chiqish' : e.name
  if (e.name === '3/4 Sit-Up' && lang === 'uz') return 'Qisman amplitudali qorin mashqi'
  if (e.custom || lang === 'en') return e.name
  return lang === 'ru' ? ruNames[e.name] || ruTranslations[e.id]?.name || e.name : uzTranslations[e.id]?.name || e.name
}
export function displayInstructions(e: Exercise) {
  const lang = getUiLanguage()
  if (e.id === 'atletika-stepper') return lang === 'en' ? ['Place the stepper on a stable, level surface.','Stand in front of it and place one whole foot on the platform.','Step up by straightening the lead leg, then lower yourself with control.','Repeat and switch legs.'] : lang === 'uz' ? ['Stepperni tekis va barqaror joyga qo‘ying.','Platforma oldida turing va bir oyog‘ingizni to‘liq uning ustiga qo‘ying.','Tayanch oyoqni to‘g‘rilab ko‘tariling, so‘ng sekin tushing.','Takrorlang va oyoqni almashtiring.'] : e.instructions
  if (e.custom || lang === 'en') return e.instructions
  return ((lang === 'ru' ? ruTranslations[e.id]?.instructions : uzTranslations[e.id]?.instructions) || e.instructions).filter(Boolean)
}
export function focusOf(e: Exercise) {
  const muscles = e.primaryMuscles.map(m => muscleLabel[m] || m)
  if (muscles.includes('Ноги') || muscles.includes('Ягодицы')) return 'Ноги'
  if (muscles.includes('Спина')) return 'Спина'
  if (muscles.includes('Пресс')) return 'Пресс'
  if (muscles.some(m => ['Бицепс','Трицепс','Руки'].includes(m))) return 'Руки'
  if (muscles.includes('Грудь')) return 'Грудь'
  return muscles[0] || 'Всё тело'
}
export function placeOf(e: Exercise) { return ['body only','dumbbell','kettlebells','bands','exercise ball','foam roll','stepper','pull-up bar',null].includes(e.equipment) ? 'Дом' : 'Зал' }
