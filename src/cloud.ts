/// <reference types="vite/client" />
import { createClient } from '@neondatabase/neon-js'
import { AppData, initialData, validImport } from './db'

const authUrl = import.meta.env.VITE_NEON_AUTH_URL
const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL
export const cloudConfigured = Boolean(authUrl && dataApiUrl)

export const cloud = cloudConfigured ? createClient({
  auth: { url: authUrl },
  dataApi: { url: dataApiUrl },
}) : null

export async function loadCloudData(userId: string): Promise<AppData> {
  if (!cloud) throw new Error('Neon is not configured')
  const { data, error } = await cloud.from('workout_data').select('payload').eq('user_id', userId).maybeSingle()
  if (error) throw error
  if (!data) return initialData
  if (!validImport(data.payload)) throw new Error('Invalid cloud data')
  return { ...initialData, ...data.payload, profile: { ...initialData.profile, ...data.payload.profile } }
}

let pendingSave: Promise<void> = Promise.resolve()
export function saveCloudData(userId: string, data: AppData): Promise<void> {
  if (!cloud) return Promise.reject(new Error('Neon is not configured'))
  const save = () => cloud.from('workout_data').upsert({ user_id: userId, payload: data, updated_at: new Date().toISOString() }, { onConflict: 'user_id' }).then(({ error }) => { if (error) throw error })
  pendingSave = pendingSave.catch(() => {}).then(save)
  return pendingSave
}
