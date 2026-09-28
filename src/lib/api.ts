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

// AI profile import — returns a DRAFT (nothing is saved server-side)
export type ImportedProfile = Omit<UserProfile, 'pricing_model' | 'availability'>

export interface ImportProfileResponse {
  profile: ImportedProfile
  sources: string[]
  warnings: string[]
}

export const importProfile = (source: { url?: string; github?: string; text?: string }) =>
  api.post<ImportProfileResponse>('/import-profile', source)

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

// A single failed status check (Neon cold start, network blip) must not fail a
// generation that is still running server-side. Retry transient errors;
// give up after MAX_POLL_FAILURES in a row. 4xx errors are real — rethrow.
const MAX_POLL_FAILURES = 3

async function pollGet<T>(url: string, params: Record<string, string>): Promise<T | null> {
  try {
    const res = await api.get<T>(url, { params })
    return res.data
  } catch (e: unknown) {
    const status = (e as { response?: { status?: number } }).response?.status
    if (status && status >= 400 && status < 500) throw e
    return null // transient — caller counts consecutive failures
  }
}

/** Server-provided error message if there is one, else the generic fallback. */
export function apiErrorMessage(e: unknown, fallback: string): string {
  const serverMsg = (e as { response?: { data?: { error?: string } } }).response?.data?.error
  if (serverMsg) return serverMsg
  return e instanceof Error && !/status code/.test(e.message) ? e.message : fallback
}

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
  let consecutiveFailures = 0
  while (Date.now() - startedAt < GENERATE_TIMEOUT_MS) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS))

    const body = await pollGet<GenerationStatusResponse>('/get-generation-status', { id: generationId })
    if (!body) {
      if (++consecutiveFailures >= MAX_POLL_FAILURES) throw new Error('Lost connection while generating — your content may still appear in the workspace shortly.')
      continue
    }
    consecutiveFailures = 0

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
  let consecutiveFailures = 0
  while (Date.now() - startedAt < GENERATE_TIMEOUT_MS) {
    await new Promise(r => setTimeout(r, POLL_INTERVAL_MS))

    const body = await pollGet<{ piece: ContentPiece & { regen_status: 'running' | 'failed' | null; regen_error: string | null } }>(
      '/get-piece-status',
      { id: pieceId }
    )
    if (!body) {
      if (++consecutiveFailures >= MAX_POLL_FAILURES) throw new Error('Lost connection while regenerating — refresh in a moment to see the result.')
      continue
    }
    consecutiveFailures = 0
    const piece = body.piece

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

// AI prospect analysis — returns a DRAFT target (nothing is saved)
export const importTarget = (url: string) =>
  api.post<{ target: Omit<TargetContext, 'id'> }>('/import-target', { url })

export const saveTarget = (target: Omit<TargetContext, 'id'>) =>
  api.post<{ target: TargetContext }>('/save-target', target)

export const getTargets = () =>
  api.get<{ targets: TargetContext[] }>('/get-targets')

export const getStats = () =>
  api.get<{ stats: WorkspaceStats }>('/get-stats')

export default api
