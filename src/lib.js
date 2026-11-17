import { SITE } from './config'

export const peso = (n) =>
  '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// ---- Influencer ref code: 30 days, latest link wins, works without storage ----
const KEY = 'cs_ref'
let memoryRef = null
const valid = (c) => /^[A-Za-z0-9_-]{1,40}$/.test(c || '')

export function captureRef() {
  try {
    const code = new URLSearchParams(window.location.search).get('ref')
    if (valid(code)) {
      memoryRef = code
      try {
        localStorage.setItem(KEY, JSON.stringify({ code, exp: Date.now() + SITE.refDays * 86400000 }))
      } catch { /* storage blocked: memory copy still counts for this visit */ }
    }
  } catch { /* ignore */ }
}

export function getRef() {
  if (memoryRef) return memoryRef
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const { code, exp } = JSON.parse(raw)
    if (valid(code) && exp > Date.now()) return code
    localStorage.removeItem(KEY)
  } catch { /* ignore */ }
  return null
}
