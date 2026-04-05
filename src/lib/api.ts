import axios from 'axios'
import { getIdToken } from './firebase'

const api = axios.create({
  baseURL: '/.netlify/functions'
})

// Attach Firebase ID token to every request
api.interceptors.request.use(async (config) => {
  const token = await getIdToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface UserProfile {
  headline: string
  bio: string
  skills: string[]
  tech_stack: string[]
  experience_years: number
  projects: Array<{
    name: string
    description: string
    url: string
    tech: string[]
    timeline: string
  }>
  social_links: {
    github?: string
    linkedin?: string
    twitter?: string
    website?: string
    devto?: string
  }
  target_market: string
  pricing_model: string
  availability: string
}

export interface Generation {
  id: string
  type: string
  content: Record<string, unknown>
  created_at: string
}

export interface ContentPiece {
  id: string
  generation_id: string
  type: string
  label: string
  content: string
  status: 'draft' | 'used' | 'replied'
  target_name?: string
  niche?: string
  platform?: string
  updated_at: string
  created_at: string
}

export interface TargetContext {
  id?: string
  name: string
  niche: string
  platform: string
  pain_point: string
}

export interface WorkspaceStats {
  total_pieces: number
  used_this_week: number
  total_replies: number
  content_types_generated: number
}

// Profile
export const saveProfile = (profile: UserProfile) =>
  api.post('/save-profile', profile)

export const getProfile = () =>
  api.get<{ profile: UserProfile | null }>('/get-profile')

// Generation
export const generateContent = (type: string, targetId?: string) =>
  api.post<{ generation: Generation; pieces: ContentPiece[] }>('/generate', { type, target_id: targetId })

export const getGenerations = () =>
  api.get<{ generations: Generation[] }>('/get-generations')

// Stripe
export const createCheckout = (priceId: string) =>
  api.post<{ url: string }>('/create-checkout', { priceId })

// User
export const getUser = () =>
  api.get<{ user: { plan: string; generations_used: number } }>('/get-user')

export const getPieces = (type?: string) =>
  api.get<{ pieces: ContentPiece[] }>('/get-pieces', { params: type ? { type } : {} })

export const updatePiece = (id: string, patch: { content?: string; status?: string }) =>
  api.patch<{ piece: ContentPiece }>('/update-piece', { id, ...patch })

export const deletePiece = (id: string) =>
  api.post('/delete-piece', { id })

export const regeneratePiece = (pieceId: string, feedback?: string) =>
  api.post<{ piece: ContentPiece }>('/regenerate-piece', { pieceId, feedback })

export const saveTarget = (target: Omit<TargetContext, 'id'>) =>
  api.post<{ target: TargetContext }>('/save-target', target)

export const getTargets = () =>
  api.get<{ targets: TargetContext[] }>('/get-targets')

export const getStats = () =>
  api.get<{ stats: WorkspaceStats }>('/get-stats')

export default api
