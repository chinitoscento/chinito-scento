import { useId, useState } from 'react'

const WORDS = {
  amber: '#d98e2b', gold: '#d9b24c', silver: '#c4c4c4', black: '#1d1b19', white: '#f7f5f0',
  pink: '#f0a3bd', rose: '#e58aa6', red: '#c0392b', blue: '#5b8fd0', green: '#5fa36f',
  purple: '#8e63b8', lavender: '#b9a2dc', clear: '#e8eef2', transparent: '#e8eef2',
  brown: '#8a5a3c', orange: '#e8893a', yellow: '#efd45a', peach: '#f4b99a', nude: '#e5c4a8',
  teal: '#3f9aa0', navy: '#2b3a67', cream: '#f2e6c9', champagne: '#ead7a6',
}

export function toColor(v, fallback) {
  if (!v) return fallback
  const s = String(v).trim().toLowerCase()
  if (/^(#|rgb|hsl)/.test(s)) return s
  for (const [w, c] of Object.entries(WORDS)) if (s.includes(w)) return c
  try { if (CSS.supports('color', s)) return s } catch { /* ignore */ }
  return fallback
}

// Glass bottle drawn from the perfume's own colors.
export function Bottle({ name = '', liquid, letter, style, className = '' }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const liq = toColor(liquid, '#d9b24c')
  const ink = toColor(letter, '#2a2420')
  const round = /round|circle|sphere|oval/i.test(style || '')
  const size = name.length > 12 ? 8 : name.length > 8 ? 10 : 12
  const body = round
    ? <ellipse cx="60" cy="130" rx="46" ry="52" />
    : <rect x="18" y="78" width="84" height="108" rx="14" />
  return (
    <svg viewBox="0 0 120 200" className={className} role="img" aria-label={`${name} perfume bottle`}>
      <defs>
        <clipPath id={`c${id}`}>{body}</clipPath>
        <linearGradient id={`g${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".55" />
          <stop offset=".35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".12" />
        </linearGradient>
      </defs>
      <rect x="44" y="6" width="32" height="34" rx="5" fill="#d9b24c" />
      <rect x="44" y="6" width="32" height="34" rx="5" fill={`url(#g${id})`} />
      <rect x="50" y="40" width="20" height="40" fill="#e9e2d3" />
      <g clipPath={`url(#c${id})`}>
        <rect x="0" y="70" width="120" height="130" fill="#f4f0e8" />
        <rect x="0" y="92" width="120" height="110" fill={liq} />
      </g>
      <g fill="none" stroke="#2a2420" strokeOpacity=".18" strokeWidth="1.5">{body}</g>
      <rect x="30" y="112" width="60" height="44" rx="4" fill="#fffdf8" fillOpacity=".92" />
      <text x="60" y="138" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontWeight="700"
        fontSize={size} fill={ink}>{name.toUpperCase().slice(0, 16)}</text>
      <g clipPath={`url(#c${id})`}><rect x="18" y="78" width="84" height="108" fill={`url(#g${id})`} /></g>
    </svg>
  )
}

export const slug = (n) => String(n).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Photo from /public/bottles/<perfume-name>.jpg, else the drawn bottle.
export function ProductImage({ p }) {
  const [failed, setFailed] = useState(false)
  if (!failed) {
    return <img src={`/bottles/${slug(p.name)}.jpg`} alt={`${p.name} perfume`} loading="lazy"
      onError={() => setFailed(true)} className="absolute inset-0 w-full h-full object-cover" />
  }
  return <Bottle name={p.name} liquid={p.liquid} letter={p.letter} style={p.style} className="h-5/6 w-auto max-w-full" />
}
