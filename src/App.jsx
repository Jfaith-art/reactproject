import { useEffect, useState } from 'react'
import { getParts } from './partsapi'
import { BIKES, CATEGORIES } from './parts'
import Header from './header'
import { getPartImage, getPartImageFallback } from './api'
 
const peso = (n) => `₱${n.toLocaleString('en-PH')}`
 
export default function App() {
  const [filters, setFilters] = useState({ query: '', category: 'all', bike: 'all' })
  const [result, setResult] = useState({ key: null, parts: [], error: null })
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const [orderMessage, setOrderMessage] = useState('')
 
  const key = JSON.stringify(filters)
  const loading = result.key !== key
 
  useEffect(() => {
    let ignore = false
    getParts(filters)
      .then((parts) => !ignore && setResult({ key, parts, error: null }))
      .catch((e) => !ignore && setResult({ key, parts: [], error: e.message }))
    return () => {
      ignore = true
    }
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps
 
  const set = (field) => (e) => setFilters((f) => ({ ...f, [field]: e.target.value }))
  const add = (part) => {
    setCart((current) => {
      const quantity = current[part.id]?.quantity ?? 0
      if (quantity >= part.stock) return current
      return { ...current, [part.id]: { part, quantity: quantity + 1 } }
    })
    setCartOpen(true)
    setOrderMessage('')
  }
  const changeQuantity = (id, amount) => {
    setCart((current) => {
      const item = current[id]
      if (!item) return current
      const quantity = item.quantity + amount
      if (quantity <= 0) {
        const next = { ...current }
        delete next[id]
        return next
      }
      return { ...current, [id]: { ...item, quantity } }
    })
  }
 
  const cartItems = Object.values(cart)
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.part.price, 0)
 
  return (
    <main className="shop">
      <Header
        cartCount={count}
        cartTotal={total}
        cartOpen={cartOpen}
        onToggleCart={() => setCartOpen((open) => !open)}
      />

      {orderMessage && <p className="note success" role="status">{orderMessage}</p>}

      {cartOpen && (
        <section className="cart-panel" id="cart-panel" aria-label="Cart contents">
          <h2>Items in your cart</h2>
          {cartItems.length === 0 ? (
            <p className="note">Your cart is empty.</p>
          ) : (
            <>
              <ul className="cart-items">
                {cartItems.map(({ part, quantity }) => (
                  <li className="cart-item" key={part.id}>
                    <div className="cart-item-info">
                      <strong>{part.name}</strong>
                      <span>{peso(part.price)} each</span>
                    </div>
                    <div className="quantity-controls" aria-label={`Quantity for ${part.name}`}>
                      <button type="button" aria-label={`Decrease ${part.name} quantity`} onClick={() => changeQuantity(part.id, -1)}>−</button>
                      <span>{quantity}</span>
                      <button type="button" aria-label={`Increase ${part.name} quantity`} disabled={quantity >= part.stock} onClick={() => changeQuantity(part.id, 1)}>+</button>
                      <button className="remove-button" type="button" onClick={() => changeQuantity(part.id, -quantity)}>Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-footer">
                <strong>Total: {peso(total)}</strong>
                <div className="cart-buttons">
                  <button className="secondary-button" type="button" onClick={() => setCart({})}>Clear cart</button>
                  <button type="button" onClick={() => {
                    setCart({})
                    setCartOpen(false)
                    setOrderMessage('Order confirmed (demo only; no payment was processed).')
                  }}>Place order</button>
                </div>
              </div>
            </>
          )}
        </section>
      )}
 
      <section className="filters" aria-label="Search and filter parts">
        <input type="search" placeholder="Search parts" value={filters.query} onChange={set('query')} />
        <select value={filters.bike} onChange={set('bike')} aria-label="Motorcycle">
          <option value="all">All motorcycles</option>
          {BIKES.map((b) => <option key={b}>{b}</option>)}
        </select>
        <select value={filters.category} onChange={set('category')} aria-label="Category">
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </section>
 
      {result.error && <p className="note error">{result.error}. Please try again.</p>}
      {loading && <p className="note">Loading parts…</p>}
      {!loading && !result.error && result.parts.length === 0 && (
        <p className="note">No parts found. Remove a filter or try a different search.</p>
      )}
 
      <ul className="parts" id="parts-catalog" aria-busy={loading}>
        {result.parts.map((p) => (
          <li key={p.id} className="part">
            <div className="part-info">
              <img
                className="part-image"
                src={getPartImage(p)}
                alt={`${p.name} illustration`}
                loading="lazy"
                width="112"
                height="84"
                onError={(event) => {
                  event.currentTarget.onerror = null
                  event.currentTarget.src = getPartImageFallback(p.category)
                }}
              />
              <div>
                <h2>{p.name}</h2>
                <p className="meta">{p.category} — fits {p.bikes.join(', ')}</p>
              </div>
            </div>
            <div className="buy">
              <strong>{peso(p.price)}</strong>
              <button type="button" disabled={p.stock === 0 || (cart[p.id]?.quantity ?? 0) >= p.stock} onClick={() => add(p)}>
                {p.stock === 0 ? 'Out of stock' : (cart[p.id]?.quantity ?? 0) >= p.stock ? 'Stock limit reached' : 'Add to cart'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}