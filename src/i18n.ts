import en from './data/ui-en.json'
import uz from './data/ui-uz.json'

export type Language = 'ru' | 'uz' | 'en'
let currentLanguage: Language = (() => { const saved=localStorage.getItem('atletika-language'); return saved === 'uz' || saved === 'en' ? saved : 'ru' })()
export function setUiLanguage(language: Language) { currentLanguage = language; document.documentElement.lang = language }
export function getUiLanguage() { return currentLanguage }

const overrides: Record<'en'|'uz',Record<string,string>> = {
  en: {
    'АТЛЕТИКА':'ATLETIKA','ТВОЙ РИТМ. ТВОЯ СИЛА.':'YOUR RHYTHM. YOUR STRENGTH.',
    'Обзор':'Overview','Упражнения':'Exercises','Мои тренировки':'My workouts','Календарь':'Calendar','Профиль':'Profile',
    'Все':'All','Ноги':'Legs','Руки':'Arms','Спина':'Back','Пресс':'Abs','Грудь':'Chest','Плечи':'Shoulders','Всё тело':'Full body',
    'Дом':'Home','Зал':'Gym','Зал и дом':'Gym and home','Вес тела':'Bodyweight','Гантели':'Dumbbells','Штанга':'Barbell','Турник':'Pull-up bar','Тренажёр':'Machine','Блок':'Cable machine','Гиря':'Kettlebell','Резинки':'Resistance bands','Степпер':'Stepper','Без оборудования':'No equipment','Другое':'Other','Фитбол':'Exercise ball','Ролик':'Foam roller','EZ-гриф':'EZ bar','Медбол':'Medicine ball',
    'Начальный':'Beginner','Средний':'Intermediate','Продвинутый':'Advanced','Набор мышц':'Build muscle','Поддержание формы':'Stay fit','Снижение веса':'Lose weight','Сила':'Strength',
    'Запланировано':'Planned','Выполнено':'Completed','Пропущено':'Missed','Изменить':'Edit','Удалить':'Delete','Свернуть':'Collapse','Смотреть план':'View plan','Дата':'Date',
    'Пн':'Mon','Вт':'Tue','Ср':'Wed','Чт':'Thu','Пт':'Fri','Сб':'Sat','Вс':'Sun',
    'упражнений найдено':'exercises found','упражнений ·':'exercises ·','упражнений · примерно':'exercises · about','мин':'min','ваших':'yours',
    'Описание техники — каждый шаг с новой строки':'Technique — one step per line','Как выполнять':'How to perform',
    'Демонстрация движения · 2 кадра':'Motion demo · 2 frames','Фото упражнения':'Exercise photo',
    'Источник: free-exercise-db · инструкции оригинального каталога могут быть на английском':'Source: free-exercise-db · instructions translated automatically',
    'Ваше упражнение':'Your exercise','Машинный перевод: проверьте технику по демонстрации и исходному описанию.':'Machine translation: check technique against the demo and original instructions.',
    'Добавить рекомендованный план':'Add recommended plan','Настроить оборудование':'Set up equipment','Удалённое упражнение':'Deleted exercise','Редактировать план':'Edit plan','Новое упражнение':'New exercise','Изменить упражнение':'Edit exercise','Тренировка':'Workout','Цель в неделю':'Weekly goal','Библиотека упражнений':'Exercise library','Мой профиль':'My profile','дн.':'days','ПРОСТРАНСТВО':'SPACE','Составить расписание по моим данным':'Build my workout schedule','Расписание создано и добавлено в календарь.':'Schedule created and added to the calendar.','Подберите доступное оборудование для создания расписания.':'Select available equipment to create a schedule.'
  },
  uz: {
    'АТЛЕТИКА':'ATLETIKA','ТВОЙ РИТМ. ТВОЯ СИЛА.':'SENING MAROMING. SENING KUCHING.',
    'Обзор':'Umumiy ko‘rinish','Упражнения':'Mashqlar','Мои тренировки':'Mashg‘ulotlarim','Календарь':'Taqvim','Профиль':'Profil',
    'Все':'Barchasi','Ноги':'Oyoqlar','Руки':'Qo‘llar','Спина':'Orqa','Пресс':'Qorin mushaklari','Грудь':'Ko‘krak','Плечи':'Yelkalar','Всё тело':'Butun tana',
    'Дом':'Uy','Зал':'Zal','Зал и дом':'Zal va uy','Вес тела':'Tana vazni','Гантели':'Gantellar','Штанга':'Shtanga','Турник':'Turnik','Тренажёр':'Trenajyor','Блок':'Blok','Гиря':'Girya','Резинки':'Rezina tasma','Степпер':'Stepper','Без оборудования':'Jihozsiz','Другое':'Boshqa','Фитбол':'Fitbol','Ролик':'Rolik','EZ-гриф':'EZ grif','Медбол':'Medbol',
    'Начальный':'Boshlang‘ich','Средний':'O‘rta','Продвинутый':'Yuqori','Набор мышц':'Mushak massasini oshirish','Поддержание формы':'Formani saqlash','Снижение веса':'Vazn kamaytirish','Сила':'Kuch',
    'Запланировано':'Rejalangan','Выполнено':'Bajarilgan','Пропущено':'O‘tkazib yuborilgan','Изменить':'Tahrirlash','Удалить':'O‘chirish','Свернуть':'Yig‘ish','Смотреть план':'Rejani ko‘rish','Дата':'Sana',
    'Пн':'Du','Вт':'Se','Ср':'Ch','Чт':'Pa','Пт':'Ju','Сб':'Sh','Вс':'Ya',
    'упражнений найдено':'ta mashq topildi','упражнений ·':'ta mashq ·','упражнений · примерно':'ta mashq · taxminan','мин':'daq','ваших':'sizniki',
    'Описание техники — каждый шаг с новой строки':'Texnika — har qadamni yangi qatordan yozing','Как выполнять':'Qanday bajariladi',
    'Демонстрация движения · 2 кадра':'Harakat namoyishi · 2 kadr','Фото упражнения':'Mashq surati',
    'Источник: free-exercise-db · инструкции оригинального каталога могут быть на английском':'Manba: free-exercise-db · yo‘riqnoma avtomatik tarjima qilingan',
    'Ваше упражнение':'Sizning mashqingiz','Машинный перевод: проверьте технику по демонстрации и исходному описанию.':'Mashina tarjimasi: texnikani namoyish va asl tavsif bilan solishtiring.',
    'Добавить рекомендованный план':'Tavsiya etilgan rejani qo‘shish','Настроить оборудование':'Jihozlarni sozlash','Удалённое упражнение':'O‘chirilgan mashq','Редактировать план':'Rejani tahrirlash','Новое упражнение':'Yangi mashq','Изменить упражнение':'Mashqni tahrirlash','Тренировка':'Mashg‘ulot','Цель в неделю':'Haftalik maqsad','Библиотека упражнений':'Mashqlar kutubxonasi','Мой профиль':'Mening profilim','дн.':'kun','ПРОСТРАНСТВО':'BO‘LIMLAR','ВАШЕ ПРОСТРАНСТВО ДЛЯ РОСТА':'RIVOJLANISH MAYDONI','План ещё свободен':'Hozircha reja yo‘q','Каждый подход':'Har bir urinish','имеет значение.':'ahamiyatli.','КАРТИНА ПРОГРЕССА':'O‘SISH KO‘RSATKICHLARI','ПОСЛЕДОВАТЕЛЬНОСТЬ':'MUNTAZAMLIK','СЛЕДУЮЩАЯ ТРЕНИРОВКА':'KEYINGI MASHG‘ULOT','Составить расписание по моим данным':'Ma’lumotlarim asosida jadval tuzish','Расписание создано и добавлено в календарь.':'Jadval yaratildi va taqvimga qo‘shildi.','Подберите доступное оборудование для создания расписания.':'Jadval tuzish uchun mavjud jihozlarni tanlang.'
  }
}
export function uiText(text: string): string {
  if (currentLanguage === 'ru') return text
  const key = text.trim()
  const translated = overrides[currentLanguage][key] || (currentLanguage === 'en' ? (en as Record<string,string>)[key] : (uz as Record<string,string>)[key])
  return translated ? text.replace(key,translated) : text
}
export function formatDate(date: string, options: Intl.DateTimeFormatOptions) {
  if (currentLanguage === 'uz' && options.month === 'long') {
    const value = new Date(`${date}T12:00:00`)
    const months = ['yanvar','fevral','mart','aprel','may','iyun','iyul','avgust','sentabr','oktabr','noyabr','dekabr']
    return `${value.getDate()} ${months[value.getMonth()]}${options.year ? ` ${value.getFullYear()}` : ''}`
  }
  return new Date(`${date}T12:00:00`).toLocaleDateString(currentLanguage === 'uz' ? 'uz-UZ' : currentLanguage === 'en' ? 'en-US' : 'ru-RU', options)
}
export function localizedPlanName(name: string) {
  if (currentLanguage === 'ru') return name
  const parts = name.split(' · ')
  if (parts.length !== 2) return name
  const first = uiText(parts[0])
  const second = uiText(parts[1][0]?.toUpperCase() + parts[1].slice(1))
  return first === parts[0] && second === parts[1] ? name : `${first} · ${second}`
}
export function profileAdviceText(goal: string, days: string, place: string) {
  const target = uiText(goal).toLowerCase()
  if(currentLanguage === 'en') return `For ${target}, aim for ${days} workouts per week. ${place === 'Дом' ? 'Start with bodyweight exercises and equipment you have.' : 'Alternate muscle groups and leave time to recover.'}`
  if(currentLanguage === 'uz') return `${target} uchun haftasiga ${days} ta mashg‘ulotni rejalang. ${place === 'Дом' ? 'Tana vazni va mavjud jihozlar bilan mashqlardan boshlang.' : 'Asosiy mushak guruhlarini almashtiring va tiklanishga vaqt ajrating.'}`
  return `Для цели «${goal.toLowerCase()}» подойдёт ${days} ${Number(days)===1?'тренировка':Number(days)<5?'тренировки':'тренировок'} в неделю. ${place === 'Дом' ? 'Начни с упражнений с весом тела и доступным инвентарём.' : 'Чередуй основные группы мышц и оставляй время на восстановление.'}`
}
export function recommendationAdviceText(hasPlan: boolean, count: number, goal: string) {
  if(currentLanguage === 'en') return hasPlan ? 'This plan matches your equipment, level and training location. Alternate muscle groups to recover.' : `A selection of ${count} exercises for ${uiText(goal).toLowerCase()}, matched to your level and equipment. Alternate muscle groups to recover.`
  if(currentLanguage === 'uz') return hasPlan ? 'Bu reja jihozlaringiz, darajangiz va mashg‘ulot joyingizga mos. Tiklanish uchun mushak guruhlarini almashtiring.' : `${uiText(goal).toLowerCase()} uchun daraja va mavjud jihozlarga mos ${count} ta mashq tanlandi. Tiklanish uchun mushak guruhlarini almashtiring.`
  return hasPlan ? 'Этот план учитывает твоё оборудование, уровень и место занятий. Для восстановления чередуй группы мышц.' : `Подбор из ${count} упражнений для цели «${goal.toLowerCase()}» с учётом уровня и доступного инвентаря. Для восстановления чередуй группы мышц.`
}
