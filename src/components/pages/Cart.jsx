import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import styles from "./Cart.module.css";

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className={styles.cartContainer}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Your <span className={styles.gradientText}>Gourmet Cart</span></h1>
        
        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any delicacies to your cart yet.</p>
            <button className={styles.btnPrimary} onClick={() => navigate("/restaurants")}>
              Find Restaurants
            </button>
          </div>
        ) : (
          <div className={styles.cartGrid}>
            <div className={styles.cartList}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                  <div className={styles.itemDetails}>
                    <h3>{item.name}</h3>
                    <p className={styles.itemCategory} style={{fontWeight: '600'}}>🏬 {item.restaurant} • 🍽️ {item.category}</p>
                    <p className={styles.itemPrice}>₹{item.price}</p>
                  </div>
                  <div className={styles.quantityControl}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div className={styles.itemTotal}>
                    ₹{item.price * item.quantity}
                  </div>
                  <button className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            
            <div className={styles.cartSummary}>
              <h3>Order Summary</h3>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{getCartTotal()}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery Fee</span>
                <span>{cartItems.some(item => item.freeDelivery) ? <span style={{color: 'var(--success)'}}>FREE</span> : `₹50`}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Taxes & GST</span>
                <span>₹{(getCartTotal() * 0.05).toFixed(0)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>₹{(getCartTotal() + (cartItems.some(item => item.freeDelivery) ? 0 : 50) + getCartTotal() * 0.05).toFixed(0)}</span>
              </div>
              <button className={styles.checkoutBtn} onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
