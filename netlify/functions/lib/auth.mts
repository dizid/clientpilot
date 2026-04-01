import admin from 'firebase-admin'
import { query } from './db.mjs'

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID
  })
}

export interface AuthUser {
  id: string
  firebase_uid: string
  email: string
  name: string
  plan: string
  generations_used: number
}

/**
 * Verify Firebase ID token from Authorization header.
 * Creates user in DB if they don't exist yet.
 */
export async function authenticateRequest(req: Request): Promise<AuthUser> {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Missing authorization token')
  }

  const token = authHeader.split('Bearer ')[1]
  const decoded = await admin.auth().verifyIdToken(token)

  // Upsert user in database
  const result = await query(
    `INSERT INTO users (firebase_uid, email, name)
     VALUES ($1, $2, $3)
     ON CONFLICT (firebase_uid)
     DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name, updated_at = NOW()
     RETURNING id, firebase_uid, email, name, plan, generations_used`,
    [decoded.uid, decoded.email, decoded.name || '']
  )

  return result.rows[0]
}
