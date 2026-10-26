import { useRef, type ChangeEvent } from 'react'
import type { Profile } from './db'
import { getUiLanguage } from './i18n'

export function AvatarImage({ profile, fallback }: { profile: Profile; fallback: string }) {
  const avatar = typeof profile.avatar === 'string' && profile.avatar.startsWith('data:image/jpeg;base64,') ? profile.avatar : ''
  return avatar ? <img src={avatar} alt="" /> : <>{fallback.charAt(0).toUpperCase() || 'А'}</>
}

const labels = {
  ru: { title: 'Фото профиля', add: 'Загрузить фото', change: 'Заменить фото', remove: 'Удалить фото', hint: 'JPG, PNG или WebP. Фото будет обрезано до квадрата.', invalid: 'Выберите изображение до 10 МБ.', failed: 'Не удалось обработать фото.', saved: 'Фото профиля обновлено.', removed: 'Фото профиля удалено.' },
  en: { title: 'Profile photo', add: 'Upload photo', change: 'Replace photo', remove: 'Remove photo', hint: 'JPG, PNG or WebP. The photo will be cropped to a square.', invalid: 'Choose an image under 10 MB.', failed: 'Could not process the photo.', saved: 'Profile photo updated.', removed: 'Profile photo removed.' },
  uz: { title: 'Profil rasmi', add: 'Rasm yuklash', change: 'Rasmni almashtirish', remove: 'Rasmni o‘chirish', hint: 'JPG, PNG yoki WebP. Rasm kvadrat shaklida kesiladi.', invalid: '10 MB dan kichik rasm tanlang.', failed: 'Rasmni qayta ishlash imkonsiz.', saved: 'Profil rasmi yangilandi.', removed: 'Profil rasmi o‘chirildi.' }
} as const

export default function ProfileAvatarEditor({ profile, fallback, onChange, toast }: {
  profile: Profile
  fallback: string
  onChange: (avatar: string) => void
  toast: (message: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const t = labels[getUiLanguage()]
  const hasAvatar = typeof profile.avatar === 'string' && profile.avatar.startsWith('data:image/jpeg;base64,')

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/') || file.size > 10 * 1024 * 1024) { toast(t.invalid); return }
    try {
      const image = await createImageBitmap(file)
      try {
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 256
        const context = canvas.getContext('2d')
        if (!context) throw new Error('Canvas unavailable')
        const side = Math.min(image.width, image.height)
        context.imageSmoothingQuality = 'high'
        context.drawImage(image, (image.width - side) / 2, (image.height - side) / 2, side, side, 0, 0, 256, 256)
        onChange(canvas.toDataURL('image/jpeg', .82))
        toast(t.saved)
      } finally { image.close() }
    } catch { toast(t.failed) }
  }

  return <div className="profile-avatar-editor">
    <div className="profile-avatar-preview"><AvatarImage profile={profile} fallback={fallback} /></div>
    <div className="profile-avatar-copy">
      <strong>{t.title}</strong>
      <p>{t.hint}</p>
      <div className="profile-avatar-actions">
        <button type="button" className="outline-button" onClick={() => inputRef.current?.click()}>{hasAvatar ? t.change : t.add}</button>
        {hasAvatar && <button type="button" className="profile-avatar-remove" onClick={() => { onChange(''); toast(t.removed) }}>{t.remove}</button>}
      </div>
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" aria-label={t.add} hidden onChange={upload} />
    </div>
  </div>
}
