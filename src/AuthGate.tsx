import { useEffect, useState } from 'react'
import { Activity, Moon, Sun } from 'lucide-react'
import { cloud, cloudConfigured } from './cloud'
import { getUiLanguage, setUiLanguage, type Language } from './i18n'

type User = { id: string; email: string; name?: string }
type Copy = { signIn: string; signUp: string; name: string; email: string; password: string; submitIn: string; submitUp: string; hint: string; checkEmail: string; loading: string; config: string; retry: string; signOut: string }
const copies: Record<Language, Copy> = {
  ru: { signIn: 'Вход', signUp: 'Регистрация', name: 'Имя', email: 'Электронная почта', password: 'Пароль', submitIn: 'Войти', submitUp: 'Создать аккаунт', hint: 'Тренировки и прогресс сохраняются в вашем аккаунте.', checkEmail: 'Аккаунт создан. Если письмо с подтверждением пришло на почту, откройте его и затем войдите.', loading: 'Загружаем аккаунт…', config: 'Для входа нужно подключить Neon. Укажите VITE_NEON_AUTH_URL и VITE_NEON_DATA_API_URL.', retry: 'Повторить', signOut: 'Выйти' },
  uz: { signIn: 'Kirish', signUp: 'Ro‘yxatdan o‘tish', name: 'Ism', email: 'Elektron pochta', password: 'Parol', submitIn: 'Kirish', submitUp: 'Hisob yaratish', hint: 'Mashg‘ulotlar va natijalar hisobingizda saqlanadi.', checkEmail: 'Hisob yaratildi. Tasdiqlash xati kelsa, uni oching va keyin tizimga kiring.', loading: 'Hisob yuklanmoqda…', config: 'Kirish uchun Neon xizmatini ulang. VITE_NEON_AUTH_URL va VITE_NEON_DATA_API_URL ni kiriting.', retry: 'Qayta urinish', signOut: 'Chiqish' },
  en: { signIn: 'Sign in', signUp: 'Sign up', name: 'Name', email: 'Email', password: 'Password', submitIn: 'Sign in', submitUp: 'Create account', hint: 'Your workouts and progress are saved to your account.', checkEmail: 'Account created. If a confirmation email arrives, open it and then sign in.', loading: 'Loading account…', config: 'Connect Neon to enable sign-in. Set VITE_NEON_AUTH_URL and VITE_NEON_DATA_API_URL.', retry: 'Retry', signOut: 'Sign out' },
}

export default function AuthGate({ children }: { children: (user: User, signOut: () => Promise<void>) => React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(getUiLanguage)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => localStorage.getItem('atletika-theme') === 'dark' ? 'dark' : 'light')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(cloudConfigured)
  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const t = copies[language]

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('atletika-theme', theme) }, [theme])
  useEffect(() => { setUiLanguage(language); localStorage.setItem('atletika-language', language); document.documentElement.lang = language }, [language])
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
  return <div className="auth-shell"><div className="auth-top"><div className="auth-brand"><Activity size={26}/><strong>GEORGRAD</strong></div><div className="auth-options"><select aria-label="Language / Til / Язык" value={language} onChange={e => setLanguage(e.target.value as Language)}><option value="ru">RU · Русский</option><option value="uz">UZ · O‘zbekcha</option><option value="en">EN · English</option></select><button type="button" aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun size={19}/> : <Moon size={19}/>}</button></div></div><section className="auth-card"><div className="auth-icon"><Activity size={31}/></div><h1>GEORGRAD<span className="accent-dot">.</span></h1><p>{t.hint}</p>{!cloudConfigured ? <div className="auth-message" role="alert">{t.config}</div> : loading ? <div className="auth-message">{t.loading}</div> : <><div className="auth-tabs"><button type="button" className={mode === 'in' ? 'active' : ''} onClick={() => { setMode('in'); setMessage('') }}>{t.signIn}</button><button type="button" className={mode === 'up' ? 'active' : ''} onClick={() => { setMode('up'); setMessage('') }}>{t.signUp}</button></div><form onSubmit={submit}>{mode === 'up' && <label>{t.name}<input required autoComplete="name" value={name} onChange={e => setName(e.target.value)}/></label>}<label>{t.email}<input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}/></label><label>{t.password}<input required type="password" minLength={8} autoComplete={mode === 'up' ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)}/></label><button className="primary-button auth-submit" disabled={busy} type="submit">{busy ? '…' : mode === 'up' ? t.submitUp : t.submitIn}</button></form>{message && <div className="auth-message" role="status">{message}</div>}</>}</section></div>
}
