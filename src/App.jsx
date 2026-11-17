import { useEffect, useMemo, useState } from 'react'
import { Minus, Plus, Trash2, CheckCircle2, Facebook, Instagram, Music2, Mail, Phone, ShoppingBag } from 'lucide-react'
import { SITE } from './config'
import { supabase, supabaseReady } from './supabaseClient'
import { peso, captureRef, getRef } from './lib'
import { ProductImage } from './Bottle'

captureRef()

const MAX_QTY = 20
const EMPTY = { name: '', contact: '', email: '', address: '', notes: '', hp: '' }

const GROUPS = [
  { key: 'Women', title: 'For women' },
  { key: 'Men', title: 'For men' },
  { key: 'Unisex', title: 'Unisex' },
]
// Reads the gender text from your perfumes table. Check "women" before "men".
function genderOf(g) {
  const s = String(g || '').toLowerCase()
  if (/women|woman|female|ladies|lady|girl|feminine/.test(s)) return 'Women'
  if (/unisex|neutral|all/.test(s)) return 'Unisex'
  if (/men|man|male|gentle|boy|masculine/.test(s)) return 'Men'
  return 'Unisex'
}

// Scent families for a perfume, read from config (name match ignores capitals).
function familiesOf(name) {
  const key = String(name || '').toUpperCase()
  const hit = Object.entries(SITE.families || {}).find(([k]) => k.toUpperCase() === key)
  return hit ? hit[1] : []
}

function notesOf(name) {
  const key = String(name || '').toUpperCase()
  const hit = Object.entries(SITE.scentNotes || {}).find(([k]) => k.toUpperCase() === key)
  return hit ? hit[1] : null
}

function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center px-6 text-center">
      <div>
        <h1 className="text-5xl">Page not found</h1>
        <p className="text-muted mt-3">That page does not exist.</p>
        <a href="/" className="cs-btn-gold mt-6">Back to the shop</a>
      </div>
    </main>
  )
}

export default function App() {
  if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') return <NotFound />

  const [rows, setRows] = useState(null)
  const [loadErr, setLoadErr] = useState('')
  const [cart, setCart] = useState({})
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState(null)
  const [tab, setTab] = useState('All')
  const [family, setFamily] = useState('All')

  useEffect(() => {
    if (!supabaseReady) { setLoadErr('The shop is not connected yet. Please check back soon.'); return }
    supabase.rpc('public_catalog').then(({ data, error }) => {
      if (error) setLoadErr('We could not load the collection. Please refresh and try again.')
      else setRows(data || [])
    })
  }, [])

  const perfumes = useMemo(() => {
    const map = new Map()
    for (const r of rows || []) {
      if (!map.has(r.perfume_name)) {
        map.set(r.perfume_name, {
          name: r.perfume_name, sku: r.sku, collection: r.collection, description: r.description,
          liquid: r.liquid_color, letter: r.lettering_color, style: r.bottle_style, gender: r.gender, sizes: [],
        })
      }
      map.get(r.perfume_name).sizes.push(r)
    }
    const list = [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
    list.forEach((p) => p.sizes.sort((a, b) => a.size_ml - b.size_ml))
    return list
  }, [rows])

  const groups = useMemo(() => {
    const out = GROUPS.map((g) => ({ ...g, items: perfumes.filter((p) => genderOf(p.gender) === g.key) }))
    return out.filter((g) => g.items.length)
  }, [perfumes])
  const availableFamilies = useMemo(
    () => (SITE.familyList || []).filter((f) => perfumes.some((p) => familiesOf(p.name).includes(f))),
    [perfumes],
  )
  const visible = (tab === 'All' ? groups : groups.filter((g) => g.key === tab))
    .map((g) => ({ ...g, items: family === 'All' ? g.items : g.items.filter((p) => familiesOf(p.name).includes(family)) }))
    .filter((g) => g.items.length)

  const bySize = useMemo(() => Object.fromEntries((rows || []).map((r) => [r.size_id, r])), [rows])
  const lines = Object.entries(cart).filter(([id]) => bySize[id]).map(([id, qty]) => ({ ...bySize[id], qty }))
  const total = lines.reduce((s, l) => s + Number(l.price) * l.qty, 0)
  const pieces = lines.reduce((s, l) => s + l.qty, 0)

  const setQty = (id, qty) =>
    setCart((c) => {
      const n = { ...c }
      if (qty <= 0) delete n[id]
      else n[id] = Math.min(qty, MAX_QTY)
      return n
    })
  const field = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setErr('')
    if (!form.name.trim()) return setErr('Please enter your name.')
    if (!form.contact.trim()) return setErr('Please enter your mobile number.')
    if (!lines.length) return setErr('Please add at least one perfume to your order.')
    setBusy(true)
    const { data, error } = await supabase.rpc('submit_order_request', {
      p_name: form.name.trim(), p_contact: form.contact.trim(), p_email: form.email.trim(),
      p_address: form.address.trim(), p_notes: form.notes.trim(),
      p_items: lines.map((l) => ({ size_id: l.size_id, qty: l.qty })),
      p_hp: form.hp, p_ref: getRef(),
    })
    setBusy(false)
    if (error) return setErr(error.message || 'Something went wrong. Please try again.')
    setDone(Number(data) || 0)
    setCart({})
    setForm(EMPTY)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const c = SITE.contact

  return (
    <div className="pb-20 sm:pb-0">
      <header className="sticky top-0 z-20 bg-bg/90 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 font-serif text-2xl font-semibold"><img src="/logo.png" alt="" className="h-10 w-10 object-contain" />{SITE.brand}</a>
          <nav className="flex items-center gap-5 text-sm text-muted">
            <a href="#collection" className="hover:text-gold2">Collection</a>
            <a href="#how" className="hover:text-gold2 hidden sm:inline">How to order</a>
            <a href="#order" className="cs-btn-gold !py-1.5 !px-4 text-ink">Order</a>
          </nav>
        </div>
      </header>

      <main id="top">
        {done !== null && (
          <div className="max-w-6xl mx-auto px-5 pt-6">
            <div role="status" className="cs-card border-good/40 bg-white p-5 flex gap-3">
              <CheckCircle2 className="text-good shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Request sent{done ? <> — your request number is <span className="font-mono text-gold2">#{done}</span></> : null}.</p>
                <p className="text-muted text-sm mt-1">Nothing has been charged. We will message you soon to confirm delivery and payment.</p>
              </div>
            </div>
          </div>
        )}

        <section>
          <div className="max-w-6xl mx-auto px-5 pt-12 pb-14 grid gap-8 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-5xl sm:text-6xl leading-[1.05]">{SITE.tagline}</h1>
              <p className="text-muted text-lg mt-5 max-w-md">{SITE.intro}</p>
              <div className="flex flex-wrap gap-3 mt-8">
                <a href="#collection" className="cs-btn-gold">Shop the collection</a>
                <a href="#how" className="cs-btn-ghost">How to order</a>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 h-72 sm:h-96" aria-hidden="true">
              {(SITE.featured || ['cucamella', 'kitty', 'gab']).map((n, i) => (
                <img key={n} src={`/bottles/${n}.jpg`} alt="" onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
                  className={`h-full w-full object-cover rounded-2xl shadow-lg ${i === 1 ? 'translate-y-6' : ''}`} />
              ))}
            </div>
          </div>
        </section>

        <section id="collection" className="max-w-6xl mx-auto px-5 py-12 scroll-mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <h2 className="text-4xl">Our collection</h2>
            {groups.length > 1 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
                {[{ key: 'All', title: 'All' }, ...groups].map((g) => (
                  <button key={g.key} onClick={() => setTab(g.key)} aria-pressed={tab === g.key}
                    className={`rounded-full px-4 py-1.5 text-sm border ${tab === g.key ? 'bg-ink text-bg border-ink' : 'bg-white border-line text-muted hover:border-gold2'}`}>
                    {g.title}
                  </button>
                ))}
              </div>
            )}
          </div>
          {SITE.concentration && <p className="text-muted -mt-2 mb-6">{SITE.concentration}</p>}
          {availableFamilies.length > 0 && (
            <div className="mb-8">
              <p className="text-sm text-muted mb-2">Find your scent. What do you like?</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by scent family">
                {['All', ...availableFamilies].map((f) => (
                  <button key={f} onClick={() => setFamily(f)} aria-pressed={family === f}
                    className={`rounded-full px-4 py-1.5 text-sm border ${family === f ? 'bg-gold text-ink border-gold' : 'bg-white border-line text-muted hover:border-gold2'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}
          {loadErr && <p className="text-bad">{loadErr}</p>}
          {!loadErr && rows === null && <p className="text-muted">Loading the collection…</p>}
          {rows && !perfumes.length && <p className="text-muted">No perfumes are available right now. Please check back soon.</p>}
          {rows && perfumes.length > 0 && !visible.length && (
            <p className="text-muted">
              No perfumes match that choice. <button onClick={() => { setFamily('All'); setTab('All') }} className="text-gold2 underline">Show all</button>
            </p>
          )}
          <div className="space-y-10">
            {visible.map((g) => (
              <div key={g.key}>
                <h3 className="text-2xl mb-4 pb-2 border-b border-line flex items-baseline gap-3">
                  {g.title}<span className="font-mono text-sm text-muted">{g.items.length}</span>
                </h3>
                <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                  {g.items.map((p) => {
                    const out = p.sizes.every((s) => !s.in_stock)
                    return (
                      <article key={p.name} className="cs-card overflow-hidden flex flex-col">
                        <div className="aspect-[4/5] relative overflow-hidden bg-panel2 grid place-items-center">
                          <ProductImage p={p} />
                          {out && <span className="absolute top-2 left-2 rounded-full bg-ink text-bg text-xs px-2.5 py-0.5">Sold out</span>}
                        </div>
                        <div className="p-3 flex flex-col flex-1">
                          <h4 className="font-serif text-xl leading-tight">{p.name}</h4>
                          <p className="text-xs text-muted mt-0.5 truncate min-h-4">{SITE.notes[p.name] || ''}</p>
                          {notesOf(p.name) && (
                            <details className="mt-1.5 text-xs group">
                              <summary className="cursor-pointer text-muted hover:text-gold2 select-none">Scent notes</summary>
                              <dl className="mt-1.5 space-y-1 text-muted">
                                {[['Top', 'top'], ['Heart', 'heart'], ['Base', 'base']].map(([label, k]) => (
                                  notesOf(p.name)[k]?.length ? (
                                    <div key={k}><dt className="inline font-medium text-ink">{label}: </dt><dd className="inline">{notesOf(p.name)[k].join(', ')}</dd></div>
                                  ) : null
                                ))}
                              </dl>
                            </details>
                          )}
                          {familiesOf(p.name).length > 0 && (
                            <p className="text-xs text-gold2 mt-1">{familiesOf(p.name).join(' · ')}</p>
                          )}
                          <ul className="mt-2 space-y-1.5">
                            {p.sizes.map((s) => (
                              <li key={s.size_id}>
                                {s.in_stock ? (
                                  <button onClick={() => setQty(s.size_id, (cart[s.size_id] || 0) + 1)}
                                    aria-label={`Add ${p.name} ${Number(s.size_ml)} ml to order`}
                                    className="w-full flex items-center justify-between gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-sm hover:border-gold2">
                                    <span className="font-mono">{Number(s.size_ml)} ml <span className="text-gold2">{peso(s.price).replace('.00', '')}</span></span>
                                    <span className="inline-flex items-center justify-center rounded-full bg-gold text-ink min-w-5 h-5 px-1 text-xs font-medium">
                                      {cart[s.size_id] ? cart[s.size_id] : <Plus size={12} />}
                                    </span>
                                  </button>
                                ) : <span className="block text-center text-sm text-warn py-1.5">{Number(s.size_ml)} ml sold out</span>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {SITE.scentNotesNote && (
          <p className="max-w-6xl mx-auto px-5 -mt-6 mb-10 text-xs text-muted">{SITE.scentNotesNote}</p>
        )}

        <section id="about" className="max-w-6xl mx-auto px-5 pb-14 scroll-mt-16">
          <div className="cs-card p-8 sm:p-12 grid md:grid-cols-2 gap-8">
            <h2 className="text-4xl">About us</h2>
            <div className="space-y-4 text-muted text-lg leading-relaxed">
              {SITE.about.map((t, i) => <p key={i}>{t}</p>)}
            </div>
          </div>
        </section>

        <section id="how" className="bg-deep text-deepink scroll-mt-16">
          <div className="max-w-6xl mx-auto px-5 py-14">
            <h2 className="text-4xl text-gold mb-8">How to order</h2>
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SITE.steps.map((s, i) => (
                <li key={i} className="border border-deepline rounded-2xl p-5">
                  <span className="font-mono text-gold">{i + 1}</span>
                  <p className="text-deepmuted mt-2">{s}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="order" className="max-w-6xl mx-auto px-5 py-14 scroll-mt-16">
          <h2 className="text-4xl mb-3">Send an order request</h2>
          <p className="text-muted mb-6 max-w-2xl">This is a request, not a purchase. Nothing is charged online. We contact you to confirm the order, delivery and payment.</p>
          <form onSubmit={submit} className="grid gap-6 lg:grid-cols-2" noValidate>
            <div className="cs-card p-5 space-y-4">
              <h3 className="text-2xl">Your details</h3>
              <div><label htmlFor="name" className="cs-label">Name *</label>
                <input id="name" className="cs-input" value={form.name} onChange={field('name')} autoComplete="name" required /></div>
              <div><label htmlFor="contact" className="cs-label">Mobile number *</label>
                <input id="contact" className="cs-input" type="tel" inputMode="tel" value={form.contact} onChange={field('contact')} autoComplete="tel" required /></div>
              <div><label htmlFor="email" className="cs-label">Email (optional)</label>
                <input id="email" className="cs-input" type="email" value={form.email} onChange={field('email')} autoComplete="email" /></div>
              <div><label htmlFor="address" className="cs-label">Delivery address</label>
                <textarea id="address" rows={3} className="cs-input" value={form.address} onChange={field('address')} autoComplete="street-address" /></div>
              <div><label htmlFor="notes" className="cs-label">Notes (optional)</label>
                <textarea id="notes" rows={2} className="cs-input" value={form.notes} onChange={field('notes')} /></div>
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                <label>Leave this empty<input tabIndex={-1} autoComplete="off" value={form.hp} onChange={field('hp')} /></label>
              </div>
            </div>

            <div className="cs-card p-5 flex flex-col">
              <h3 className="text-2xl">Your order</h3>
              {!lines.length ? (
                <p className="text-muted mt-4 flex-1">Nothing added yet. Use the Add buttons in the <a href="#collection" className="text-gold2 underline">collection</a>.</p>
              ) : (
                <ul className="mt-4 divide-y divide-line flex-1">
                  {lines.map((l) => (
                    <li key={l.size_id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate">{l.perfume_name}</p>
                        <p className="text-sm text-muted font-mono">{Number(l.size_ml)} ml · {peso(l.price)}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button type="button" className="cs-btn-ghost !p-1.5" onClick={() => setQty(l.size_id, l.qty - 1)} aria-label={`Fewer ${l.perfume_name} ${Number(l.size_ml)} ml`}>
                          {l.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}</button>
                        <span className="font-mono w-6 text-center" aria-live="polite">{l.qty}</span>
                        <button type="button" className="cs-btn-ghost !p-1.5" onClick={() => setQty(l.size_id, l.qty + 1)} disabled={l.qty >= MAX_QTY} aria-label={`More ${l.perfume_name} ${Number(l.size_ml)} ml`}>
                          <Plus size={14} /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="border-t border-line mt-4 pt-4">
                <div className="flex justify-between">
                  <span className="text-muted">Estimated total ({pieces} {pieces === 1 ? 'piece' : 'pieces'})</span>
                  <span className="font-mono text-gold2 text-lg">{peso(total)}</span>
                </div>
                <p className="text-xs text-muted mt-1">Delivery fee not included. We confirm the final amount with you.</p>
                {err && <p role="alert" className="text-bad mt-3">{err}</p>}
                <button className="cs-btn-gold w-full mt-4" disabled={busy || !supabaseReady}>{busy ? 'Sending…' : 'Send order request'}</button>
              </div>
            </div>
          </form>
        </section>
      </main>

      {pieces > 0 && (
        <a href="#order" className="sm:hidden fixed bottom-3 inset-x-3 z-30 cs-btn-gold shadow-lg justify-between">
          <span className="flex items-center gap-2"><ShoppingBag size={18} /> {pieces} {pieces === 1 ? 'piece' : 'pieces'}</span>
          <span className="font-mono">{peso(total)} · Review</span>
        </a>
      )}

      <footer className="bg-deep text-deepmuted">
        <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
          <div>
            <img src="/logo.png" alt="Chinito Scento logo" className="h-20 w-20 object-contain -ml-1 mb-1" />
            <p className="font-serif text-2xl text-gold">{SITE.brand}</p>
            <p className="text-sm mt-1">© {new Date().getFullYear()} {SITE.brand}</p>
          </div>
          <div className="text-sm space-y-1.5">
            <p className="flex items-center gap-2"><Phone size={14} /> <a href={`tel:${c.mobile.replace(/\s/g, '')}`} className="font-mono hover:text-gold">{c.mobile}</a></p>
            <p className="flex items-center gap-2"><Mail size={14} /> <a href={`mailto:${c.email}`} className="hover:text-gold">{c.email}</a></p>
          </div>
          <div className="flex gap-4">
            {c.facebook && <a href={c.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-gold"><Facebook size={20} /></a>}
            {c.instagram && <a href={c.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gold"><Instagram size={20} /></a>}
            {c.tiktok && <a href={c.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-gold"><Music2 size={20} /></a>}
          </div>
        </div>
      </footer>
    </div>
  )
}
