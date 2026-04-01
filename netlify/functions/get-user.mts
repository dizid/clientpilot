import { authenticateRequest } from './lib/auth.mjs'

export default async (req: Request) => {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const user = await authenticateRequest(req)
    return Response.json({ user: { plan: user.plan, generations_used: user.generations_used } })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Auth failed'
    return Response.json({ error: message }, { status: 401 })
  }
}
