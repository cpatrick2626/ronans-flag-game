import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const OVERRIDES_PATH = path.join(process.cwd(), 'public', 'hitedit-overrides.json')

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json()
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid overrides payload' }, { status: 400 })
    }
    fs.writeFileSync(OVERRIDES_PATH, JSON.stringify(body, null, 2) + '\n')
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
