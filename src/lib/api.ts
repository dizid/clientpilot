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

// Profile
export const saveProfile = (profile: UserProfile) =>
  api.post('/save-profile', profile)

export const getProfile = () =>
  api.get<{ profile: UserProfile | null }>('/get-profile')

// Generation
export const generateContent = (type: string) =>
  api.post<{ generation: Generation }>('/generate', { type })

export const getGenerations = () =>
  api.get<{ generations: Generation[] }>('/get-generations')

// Stripe
export const createCheckout = (priceId: string) =>
  api.post<{ url: string }>('/create-checkout', { priceId })

// User
export const getUser = () =>
  api.get<{ user: { plan: string; generations_used: number } }>('/get-user')

export default api
