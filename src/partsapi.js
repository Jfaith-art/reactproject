import { PARTS } from './parts'
 
// Walang VITE_API_URL -> gagamit ng local na data (mock API).
// May VITE_API_URL (hal. http://localhost:3000/api) -> tatawag sa totoong backend.
const BASE = import.meta.env.VITE_API_URL
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
 
// GET /parts?query=&category=&bike=
export async function getParts({ query = '', category = 'all', bike = 'all' } = {}) {
  if (BASE) {
    const qs = new URLSearchParams({ query, category, bike })
    const res = await fetch(`${BASE}/parts?${qs}`)
    if (!res.ok) throw new Error(`Hindi ma-load ang parts (${res.status})`)
    return res.json()
  }
  await wait(300)
  const q = query.trim().toLowerCase()
  return PARTS.filter(
    (p) =>
      (category === 'all' || p.category === category) &&
      (bike === 'all' || p.bikes.includes(bike)) &&
      (!q || p.name.toLowerCase().includes(q)),
  )
}
 
// GET /parts/:id
export async function getPart(id) {
  if (BASE) {
    const res = await fetch(`${BASE}/parts/${id}`)
    if (!res.ok) throw new Error(`Hindi nahanap ang part (${res.status})`)
    return res.json()
  }
  await wait(200)
  const part = PARTS.find((p) => p.id === Number(id))
  if (!part) throw new Error('Hindi nahanap ang part')
  return part
}