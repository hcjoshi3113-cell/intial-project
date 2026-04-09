import { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { authContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { LocationContext } from "../context/LocationContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { foodList } from "../../data/foodData";
import styles from "./Navbar.module.css";

function NavbarComponent() {
  const { user } = useContext(authContext);
  const { getCartCount } = useContext(CartContext);
  const { city, changeCity } = useContext(LocationContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);



  const handleLogout = async () => {
    await signOut(auth);
    setIsOpen(false);
  };

  const closeMobile = () => setIsOpen(false);

  const CITIES = ['All', 'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Gandhinagar', 'Jamnagar', 'Somnath', 'Dwarka', 'Kutch'];

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}>
        <div className={styles.container}>
          <NavLink to="/" className={styles.navLogo} onClick={closeMobile}>
            <span className={styles.logoIcon}>🍔</span> TastyHub <span className={styles.vegBadge}>Pure Veg</span>
          </NavLink>



          <div className={styles.navLinks}>


            <NavLink to="/" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`} end>Home</NavLink>
            <NavLink to="/restaurants" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>Find Restaurants</NavLink>
            <NavLink to="/about" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>About</NavLink>
            
            {user && (
              <>
                <NavLink to="/myorders" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>My Orders</NavLink>
                <NavLink to="/profile" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ""}`}>Profile</NavLink>
              </>
            )}

            <NavLink to="/cart" className={({ isActive }) => `${styles.link} ${styles.cartLink} ${isActive ? styles.active : ""}`} aria-label="My Cart">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getCartCount() > 0 && <span className={styles.cartCount}>{getCartCount()}</span>}
            </NavLink>

            {user ? (
              <button onClick={handleLogout} className={styles.navCta} style={{ background: "rgba(239,68,68,.9)" }}>Logout</button>
            ) : (
              <NavLink to="/auth" className={styles.navCta}>Sign Up</NavLink>
            )}
          </div>

          <button className={styles.hamburger} onClick={() => setIsOpen(true)} aria-label="Open menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className={`${styles.mobileNav} ${isOpen ? styles.mobileOpen : ""}`}>
        <button className={styles.closeBtn} onClick={closeMobile} aria-label="Close menu">&times;</button>

        <NavLink to="/" onClick={closeMobile}>Home</NavLink>
        <NavLink to="/restaurants" onClick={closeMobile}>Find Restaurants</NavLink>
        <NavLink to="/about" onClick={closeMobile}>About</NavLink>
        {user && (
          <>
            <NavLink to="/myorders" onClick={closeMobile}>My Orders</NavLink>
            <NavLink to="/profile" onClick={closeMobile}>Profile</NavLink>
          </>
        )}
        {user ? (
          <button onClick={handleLogout} className={styles.mobileLogout}>Logout</button>
        ) : (
          <NavLink to="/auth" onClick={closeMobile}>Sign Up</NavLink>
        )}
      </div>
    </>
  );
}

export default NavbarComponent;
