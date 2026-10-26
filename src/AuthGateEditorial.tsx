import { useEffect, useRef, useState } from 'react'
import { cloud, cloudConfigured } from './cloud'
import { catalog, displayInstructions, displayName, imageUrl, placeOf } from './catalog'
import { getUiLanguage, setUiLanguage, type Language } from './i18n'
import type { Exercise } from './db'
import ExerciseMotion from './ExerciseMotion'

type User = { id: string; email: string; name?: string }
type Mode = 'in' | 'up'

const copy = {
  ru: {
    journal: 'ЖУРНАЛ ТРЕНИРОВОК', photoTop: 'ТРЕНИРУЙСЯ ОСОЗНАННО', photoBottom: 'ПЛАН · ДВИЖЕНИЕ · РЕЗУЛЬТАТ', headline: <>ДВИЖЕНИЕ<br />ИМЕЕТ ВЕС.</>, mobileHeadline: <>КАЖДЫЙ<br />ПОВТОР.</>,
    subtitle: 'Планируйте занятия, изучайте упражнения и отмечайте каждый выполненный день.',
    entry: 'Личный кабинет', enter: 'Вход', create: 'Регистрация', name: 'Имя',
    email: 'Электронная почта', password: 'Пароль', submitIn: 'Войти в аккаунт',
    submitUp: 'Создать аккаунт', foot: 'Ваши записи сохраняются в вашем аккаунте.',
    checkEmail: 'Аккаунт создан. Если пришло письмо с подтверждением, откройте его и затем войдите.',
    loading: 'Загружаем аккаунт…', config: 'Для входа нужно подключить Neon.',
    preview: 'Загляните внутрь', previewTitle: 'Упражнения для настоящих занятий.',
    previewText: 'Откройте упражнение, чтобы посмотреть технику. В каталоге есть варианты для дома и зала.',
    all: 'Все', home: 'Дома', gym: 'В зале', how: 'Как выполнять',
    close: 'Закрыть', unavailable: 'Фото недоступно', view: 'Смотреть упражнение', privacy: 'Конфиденциальность',
    terms: 'Условия использования', start: 'Начать работу',
    rhythm: ['ПЛАНИРУЙ', 'ЗАПИСЫВАЙ', 'ПОВТОРЯЙ'],
    shout: 'НАЧНИ',
  },
  uz: {
    journal: 'MASHG‘ULOTLAR KUNDALIGI', photoTop: 'ONG BILAN MASHQ QIL', photoBottom: 'REJA · HARAKAT · NATIJA', headline: <>HAR BIR<br />HARAKAT MUHIM.</>, mobileHeadline: <>HAR KUN<br />HISOBDA.</>,
    subtitle: 'Mashg‘ulotlarni rejalang, mashqlarni o‘rganing va har bir bajarilgan kunni belgilang.',
    entry: 'Shaxsiy kabinet', enter: 'Kirish', create: 'Ro‘yxatdan o‘tish', name: 'Ism',
    email: 'Elektron pochta', password: 'Parol', submitIn: 'Hisobga kirish',
    submitUp: 'Hisob yaratish', foot: 'Yozuvlaringiz hisobingizda saqlanadi.',
    checkEmail: 'Hisob yaratildi. Tasdiqlash xati kelsa, uni oching va keyin kiring.',
    loading: 'Hisob yuklanmoqda…', config: 'Kirish uchun Neon xizmatini ulang.',
    preview: 'Ichkariga nazar', previewTitle: 'Haqiqiy mashg‘ulotlar uchun mashqlar.',
    previewText: 'Texnikani ko‘rish uchun mashqni oching. Katalogda uy va zal uchun mashqlar bor.',
    all: 'Barchasi', home: 'Uyda', gym: 'Zalda', how: 'Qanday bajariladi',
    close: 'Yopish', unavailable: 'Rasm mavjud emas', view: 'Mashqni ko‘rish', privacy: 'Maxfiylik',
    terms: 'Foydalanish shartlari', start: 'Boshlash',
    rhythm: ['REJALA', 'YOZIB BOR', 'TAKRORLA'],
    shout: 'BOSHLA',
  },
  en: {
    journal: 'TRAINING JOURNAL', photoTop: 'TRAIN WITH INTENTION', photoBottom: 'PLAN · MOVE · PROGRESS', headline: <>EVERY REP<br />COUNTS.</>, mobileHeadline: <>EVERY REP<br />COUNTS.</>,
    subtitle: 'Plan sessions, learn movements and mark every day you showed up.',
    entry: 'Your account', enter: 'Sign in', create: 'Sign up', name: 'Name',
    email: 'Email', password: 'Password', submitIn: 'Sign in',
    submitUp: 'Create account', foot: 'Your records are saved to your account.',
    checkEmail: 'Account created. If a confirmation email arrives, open it and then sign in.',
    loading: 'Loading account…', config: 'Connect Neon to enable sign-in.',
    preview: 'Look inside', previewTitle: 'Exercises for real training.',
    previewText: 'Open an exercise to see the technique. The catalog covers home and gym.',
    all: 'All', home: 'At home', gym: 'At the gym', how: 'How to do it',
    close: 'Close', unavailable: 'Image unavailable', view: 'View exercise', privacy: 'Privacy',
    terms: 'Terms of use', start: 'Get started',
    rhythm: ['PLAN', 'RECORD', 'REPEAT'],
    shout: 'START',
  },
}
const previewOrder = ['Bodyweight_Squat', 'Dumbbell_Bench_Press', 'Pullups', 'Barbell_Bench_Press_-_Medium_Grip', 'Plank', 'Pushups']
const previewPool = previewOrder.map(id => catalog.find(e => e.id === id)).filter((e): e is Exercise => Boolean(e))
function PreviewPhoto({ exercise, unavailable }: { exercise: Exercise; unavailable: string }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [exercise.id])
  return failed ? <span className="entry-image-fallback">{unavailable}</span> : <img src={imageUrl(exercise.images[0])} alt="" loading="lazy" onError={() => setFailed(true)} />
}

export default function AuthGateEditorial({ children }: { children: (user: User, signOut: () => Promise<void>) => React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(getUiLanguage)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => localStorage.getItem('atletika-theme') === 'dark' ? 'dark' : 'light')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(cloudConfigured)
  const [mode, setMode] = useState<Mode>('in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [previewPlace, setPreviewPlace] = useState<'Все' | 'Дом' | 'Зал'>('Все')
  const [selected, setSelected] = useState<Exercise | null>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const revealRef = useRef<HTMLDivElement>(null)
  const t = copy[language]
  const preview = previewPool.filter(e => previewPlace === 'Все' || placeOf(e) === previewPlace).slice(0, 4)

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('atletika-theme', theme) }, [theme])
  useEffect(() => { setUiLanguage(language); localStorage.setItem('atletika-language', language); document.documentElement.lang = language }, [language])
  useEffect(() => {
    const photo = photoRef.current
    const reveal = revealRef.current
    if (!photo || !reveal || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    let x = -500, y = -500, radius = 0
    let targetX = x, targetY = y, targetRadius = 0
    const paint = () => {
      x += (targetX - x) * .24
      y += (targetY - y) * .24
      radius += (targetRadius - radius) * .24
      const mask = `radial-gradient(circle ${radius}px at ${x}px ${y}px, #fff 0%, #fff 42%, rgba(255,255,255,.78) 62%, transparent 100%)`
      reveal.style.webkitMaskImage = mask
      reveal.style.maskImage = mask
      if (Math.abs(targetX - x) + Math.abs(targetY - y) + Math.abs(targetRadius - radius) > .5) frame = requestAnimationFrame(paint)
      else frame = 0
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint) }
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch' && event.buttons === 0) return
      const rect = photo.getBoundingClientRect()
      targetX = event.clientX - rect.left
      targetY = event.clientY - rect.top
      targetRadius = window.innerWidth < 480 ? 145 : window.innerWidth < 720 ? 190 : 280
      schedule()
    }
    const leave = () => { targetRadius = 0; schedule() }
    photo.addEventListener('pointermove', move)
    photo.addEventListener('pointerdown', move)
    photo.addEventListener('pointerleave', leave)
    photo.addEventListener('pointerup', leave)
    photo.addEventListener('pointercancel', leave)
    return () => {
      cancelAnimationFrame(frame)
      photo.removeEventListener('pointermove', move)
      photo.removeEventListener('pointerdown', move)
      photo.removeEventListener('pointerleave', leave)
      photo.removeEventListener('pointerup', leave)
      photo.removeEventListener('pointercancel', leave)
    }
  }, [])
  useEffect(() => {
    if (!selected) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKeyDown)
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', onKeyDown) }
  }, [selected])

  async function refresh() {
    if (!cloud) return
    setLoading(true)
    try {
      const result = await cloud.auth.getSession()
      setUser(result.data?.user ? { id: result.data.user.id, email: result.data.user.email, name: result.data.user.name } : null)
      if (result.error) setMessage(result.error.message || 'Authentication error')
    } catch (error) { setMessage(error instanceof Error ? error.message : String(error)) }
    finally { setLoading(false) }
  }
  useEffect(() => { void refresh() }, [])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!cloud) return
    setBusy(true); setMessage('')
    try {
      const result = mode === 'up'
        ? await cloud.auth.signUp.email({ name: name.trim(), email: email.trim(), password })
        : await cloud.auth.signIn.email({ email: email.trim(), password })
      if (result.error) throw result.error
      await refresh()
      if (mode === 'up') { setMessage(t.checkEmail); setMode('in') }
    } catch (error) { setMessage(error instanceof Error ? error.message : String(error)) }
    finally { setBusy(false) }
  }

  async function signOut() {
    if (!cloud) return
    const result = await cloud.auth.signOut()
    if (result.error) { setMessage(result.error.message || 'Authentication error'); return }
    setUser(null)
  }

  if (user) return <>{children(user, signOut)}</>

  return <div className="entry-page">
    <header className="entry-header">
      <a className="entry-logo" href="#top" aria-label="GEORGRAD">GEORGRAD<span className="entry-logo-mark">/</span></a>
      <span className="entry-header-note">{t.journal}</span>
      <div className="entry-controls">
        <select aria-label="Language / Til / Язык" value={language} onChange={e => { const next = e.target.value as Language; setUiLanguage(next); setLanguage(next) }}>
          <option value="ru">RU</option><option value="uz">UZ</option><option value="en">EN</option>
        </select>
        <button type="button" className="entry-theme" aria-label={theme === 'dark' ? 'Светлая тема / Light theme' : 'Тёмная тема / Dark theme'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'СВЕТ' : 'ТЬМА'}</button>
      </div>
    </header>

    <main id="top" className="entry-main">
      <section className="entry-hero" aria-labelledby="entry-title">
        <div className="entry-photo" ref={photoRef}>
          <div className="entry-photo-base" aria-hidden="true" />
          <div className="entry-photo-reveal" ref={revealRef} aria-hidden="true" />
          <div className="entry-photo-top"><span>01 / GEORGRAD</span><span>{t.photoTop}</span></div>
          <div className="entry-photo-copy"><span className="entry-overline">{t.journal}</span><h1 id="entry-title"><span className="entry-headline-desktop">{t.headline}</span><span className="entry-headline-mobile">{t.mobileHeadline}</span></h1><span className="entry-shout" aria-hidden="true">{t.shout}</span><p>{t.subtitle}</p></div>
          <span className="entry-photo-bottom">{t.photoBottom}</span>
        </div>
        <aside id="account" className="entry-account">
          <div className="entry-account-top"><span>02 / {t.entry}</span><span>GEORGRAD</span></div>
          <div className="entry-account-inner">
            <div className="entry-account-title"><span>{t.journal}</span><h2 className={mode === 'up' ? 'entry-registration-title' : undefined}>{mode === 'in' ? t.enter : t.create}</h2><p>{t.foot}</p></div>
            {!cloudConfigured ? <div className="entry-message" role="alert">{t.config}</div> : loading ? <div className="entry-message">{t.loading}</div> : <>
              <div className="entry-tabs" role="tablist" aria-label={t.entry}>
                <button role="tab" aria-selected={mode === 'in'} className={mode === 'in' ? 'active' : ''} onClick={() => { setMode('in'); setMessage('') }}>{t.enter}</button>
                <button role="tab" aria-selected={mode === 'up'} className={mode === 'up' ? 'active' : ''} onClick={() => { setMode('up'); setMessage('') }}>{t.create}</button>
              </div>
              <form onSubmit={submit}>
                {mode === 'up' && <label>{t.name}<input required autoComplete="name" value={name} onChange={e => setName(e.target.value)} /></label>}
                <label>{t.email}<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
                <label>{t.password}<input required type="password" minLength={8} autoComplete={mode === 'up' ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)} /></label>
                <button className="entry-submit" disabled={busy} type="submit"><span>{busy ? '…' : mode === 'up' ? t.submitUp : t.submitIn}</span><span aria-hidden="true">↗</span></button>
              </form>
              {message && <div className="entry-message" role="status">{message}</div>}
            </>}
          </div>
          <div className="entry-account-bottom">{t.rhythm.map(word => <span key={word}>{word}</span>)}</div>
        </aside>
      </section>

      <section className="entry-preview" aria-labelledby="entry-preview-title">
        <div className="entry-section-heading"><span>03 / {t.preview}</span><h2 id="entry-preview-title">{t.previewTitle}</h2><p>{t.previewText}</p></div>
        <div className="entry-preview-controls" role="group" aria-label={t.preview}>
          {([['Все', t.all], ['Дом', t.home], ['Зал', t.gym]] as const).map(([value, label]) => <button key={value} type="button" className={previewPlace === value ? 'selected' : ''} aria-pressed={previewPlace === value} onClick={() => setPreviewPlace(value)}>{label}</button>)}
        </div>
        <div className="entry-preview-grid">{preview.map((exercise, index) => <button type="button" className="entry-preview-item" key={exercise.id} onClick={() => setSelected(exercise)}>
          <span className="entry-preview-image"><PreviewPhoto exercise={exercise} unavailable={t.unavailable} /></span>
          <span className="entry-preview-meta"><small>{String(index + 1).padStart(2, '0')} / {placeOf(exercise) === 'Дом' ? t.home : t.gym}</small><strong>{displayName(exercise)}</strong><span>{t.view} ↗</span></span>
        </button>)}</div>
      </section>
    </main>

    <footer className="entry-footer"><strong>GEORGRAD</strong><span>{t.journal}</span><nav><a href="/privacy.html">{t.privacy}</a><a href="/terms.html">{t.terms}</a></nav></footer>
    {selected && <div className="entry-dialog-backdrop" onMouseDown={() => setSelected(null)}><section role="dialog" aria-modal="true" aria-label={displayName(selected)} className="entry-dialog" onMouseDown={e => e.stopPropagation()}><button className="entry-dialog-close" onClick={() => setSelected(null)} aria-label={t.close}>×</button><div className="entry-dialog-photo"><ExerciseMotion exercise={selected} /></div><div className="entry-dialog-copy"><span>{t.how}</span><h2>{displayName(selected)}</h2><ol>{displayInstructions(selected).map((step, index) => <li key={index}>{step}</li>)}</ol><a href="#account" onClick={() => setSelected(null)}>{t.start} ↗</a></div></section></div>}
  </div>
}
