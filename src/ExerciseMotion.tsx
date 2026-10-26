import { useEffect, useState } from 'react'
import { displayName, imageUrl } from './catalog'
import type { Exercise } from './db'
import { getUiLanguage } from './i18n'

const labels = {
  ru: { unavailable: 'Демонстрация недоступна', photo: 'Фото упражнения', motion: 'Демонстрация движения', pause: 'Остановить анимацию', play: 'Воспроизвести анимацию' },
  uz: { unavailable: 'Namoyish mavjud emas', photo: 'Mashq surati', motion: 'Harakat namoyishi', pause: 'Animatsiyani to‘xtatish', play: 'Animatsiyani boshlash' },
  en: { unavailable: 'Demonstration unavailable', photo: 'Exercise photo', motion: 'Movement demonstration', pause: 'Pause animation', play: 'Play animation' },
}

export default function ExerciseMotion({ exercise }: { exercise: Exercise }) {
  const [frame, setFrame] = useState(0)
  const [failed, setFailed] = useState<number[]>([])
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const sourceKey = (exercise.images || []).join('|')
  const available = (exercise.images || []).map((source, index) => ({ source, index })).filter(({ index }) => !failed.includes(index))
  const availableKey = available.map(({ index }) => index).join(',')
  const active = available.some(({ index }) => index === frame) ? frame : available[0]?.index
  const t = labels[getUiLanguage()]

  useEffect(() => {
    setFrame(0)
    setFailed([])
    setPlaying(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [exercise.id, sourceKey])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setPlaying(!preference.matches)
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!playing || available.length < 2) return
    const timer = window.setInterval(() => setFrame(current => {
      const position = available.findIndex(({ index }) => index === current)
      return available[(position + 1) % available.length].index
    }), 1100)
    return () => window.clearInterval(timer)
  }, [availableKey, playing, exercise.id])

  return <div className="exercise-motion">
    {available.length ? (exercise.images || []).map((source, index) => !failed.includes(index) && <img
      key={`${index}-${source}`}
      src={imageUrl(source)}
      alt={index === active ? displayName(exercise) : ''}
      aria-hidden={index !== active}
      className={index === active ? 'is-active' : ''}
      onError={() => setFailed(previous => previous.includes(index) ? previous : [...previous, index])}
    />) : <div className="exercise-motion-fallback" role="img" aria-label={t.unavailable}>{t.unavailable}</div>}
    <span className="exercise-motion-badge">{available.length > 1 ? `${t.motion} · ${available.length}` : available.length ? t.photo : t.unavailable}</span>
    {available.length > 1 && <button type="button" className="exercise-motion-toggle" onClick={() => setPlaying(value => !value)} aria-label={playing ? t.pause : t.play}>{playing ? 'Ⅱ' : '▶'}</button>}
  </div>
}
