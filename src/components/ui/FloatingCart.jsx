import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import styles from "./FloatingCart.module.css";

function FloatingCart() {
  const { getCartCount, getCartTotal, cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const count = getCartCount();

  useEffect(() => {
    if (count > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [count]);

  if (count === 0) return null;

  return (
    <div 
      className={`${styles.floatingBtn} ${isAnimating ? styles.pulse : ""}`}
      onClick={() => navigate("/cart")}
      title="View your Cart"
    >
      <div className={styles.iconArea}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
          <path d="M3 6h18M16 10a4 4 0 01-8 0" />
        </svg>
        <span className={styles.countBadge}>{count}</span>
      </div>
      <div className={styles.infoArea}>
        <span className={styles.price}>₹{getCartTotal().toLocaleString("en-IN")}</span>
        <span className={styles.label}>Cart Total</span>
      </div>
    </div>
  );
}

export default FloatingCart;
