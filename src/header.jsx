function formatPeso(amount) {
  return `₱${amount.toLocaleString('en-PH')}`
}

export default function Header({ cartCount, cartTotal, cartOpen, onToggleCart }) {
  return (
    <header className="top">
      <a className="brand" href="#parts-catalog">
        <h1>Parts Depot</h1>
        <span>Motorcycle parts</span>
      </a>
      <button
        className="cart-toggle"
        type="button"
        aria-expanded={cartOpen}
        aria-controls="cart-panel"
        onClick={onToggleCart}
      >
        Cart: {cartCount} item{cartCount === 1 ? '' : 's'}
        {cartTotal > 0 && ` · ${formatPeso(cartTotal)}`}
      </button>
    </header>
  )
}