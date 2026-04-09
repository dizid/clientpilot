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

// ── Generation (async enqueue + poll) ──────────────────────────────────────
//
// Backend pattern:
//   1. POST /generate → returns { generation_id, status: 'queued' } (202)
//   2. Background worker runs (up to ~12 min) — Starter plan friendly
//   3. Client polls GET /get-generation-status?id=... until status='complete'
//
// We expose `generateContent` with the same shape as before so callers don't
// have to change. It resolves when the backend signals complete, rejects on
// failure or timeout.

const POLL_INTERVAL_MS = 2000
const GENERATE_TIMEOUT_MS = 3 * 60 * 1000 // 3 min — plenty for Haiku 4.5

interface GenerationStatusResponse {
  status: 'queued' | 'running' | 'complete' | 'failed'
  error?: string
  generation?: Generation
  pieces?: ContentPiece[]
}

export async function generateContent(
  type: string,
  targetId?: string
): Promise<{ data: { generation: Generation; pieces: ContentPiece[] } }> {
  // Step 1: enqueue
  const enqueueRes = await api.post<{ generation_id: string; status: string }>(
    '/generate',
    { type, target_id: targetId }
  )
  const generationId = enqueueRes.data.generation_id

  // Step 2: poll until complete / failed / timeout
  const startedAt = Date.now()
  while (Date.now() - startedAt < GENERATE_TIMEOUT_MS) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS))

    const statusRes = await api.get<GenerationStatusResponse>(
      '/get-generation-status',
      { params: { id: generationId } }
    )
    const body = statusRes.data

    if (body.status === 'complete' && body.generation && body.pieces) {
      return { data: { generation: body.generation, pieces: body.pieces } }
    }
    if (body.status === 'failed') {
      throw new Error(body.error || 'Generation failed')
    }
    // else: 'queued' | 'running' — keep polling
  }

  throw new Error('Generation timed out after 3 minutes. Please try again.')
}

export const getGenerations = () =>
  api.get<{ generations: Generation[] }>('/get-generations')

// Stripe
export const createCheckout = (priceId: string) =>
  api.post<{ url: string }>('/create-checkout', { priceId })

// User
export const getUser = () =>
  api.get<{ user: { plan: string; generations_used: number; has_profile: boolean } }>('/get-user')

export const getPieces = (type?: string) =>
  api.get<{ pieces: ContentPiece[] }>('/get-pieces', { params: type ? { type } : {} })

export const updatePiece = (id: string, patch: { content?: string; status?: string }) =>
  api.patch<{ piece: ContentPiece }>('/update-piece', { id, ...patch })

export const deletePiece = (id: string) =>
  api.post('/delete-piece', { id })

// Piece regeneration uses the same async enqueue + poll pattern as generateContent.
// Caller signature unchanged: resolves with the updated piece, rejects on failure.
export async function regeneratePiece(
  pieceId: string,
  feedback?: string
): Promise<{ data: { piece: ContentPiece } }> {
  // Step 1: enqueue (server marks regen_status='running' and dispatches worker)
  await api.post('/regenerate-piece', { pieceId, feedback })

  // Step 2: poll the piece until regen_status clears or fails
  const startedAt = Date.now()
  while (Date.now() - startedAt < GENERATE_TIMEOUT_MS) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS))

    const statusRes = await api.get<{ piece: ContentPiece & { regen_status: 'running' | 'failed' | null; regen_error: string | null } }>(
      '/get-piece-status',
      { params: { id: pieceId } }
    )
    const piece = statusRes.data.piece

    if (piece.regen_status === null) {
      // Success — content has been updated
      return { data: { piece } }
    }
    if (piece.regen_status === 'failed') {
      throw new Error(piece.regen_error || 'Regeneration failed')
    }
    // else: 'running' — keep polling
  }

  throw new Error('Regeneration timed out after 3 minutes. Please try again.')
}

export const saveTarget = (target: Omit<TargetContext, 'id'>) =>
  api.post<{ target: TargetContext }>('/save-target', target)

export const getTargets = () =>
  api.get<{ targets: TargetContext[] }>('/get-targets')

export const getStats = () =>
  api.get<{ stats: WorkspaceStats }>('/get-stats')

export default api
