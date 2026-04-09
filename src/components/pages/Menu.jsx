import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { foodList } from "../../data/foodData";
import { LocationContext } from "../context/LocationContext";
import styles from "./Menu.module.css";

function Menu() {
  const navigate = useNavigate();
  const { restaurantName } = useParams();
  const { city } = useContext(LocationContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterFreeDelivery, setFilterFreeDelivery] = useState(false);

  const locationDishes = city === 'All' ? foodList : foodList.filter(d => d.city === city);
  
  const restaurantDishes = restaurantName 
    ? locationDishes.filter(d => d.restaurant.toLowerCase() === restaurantName.toLowerCase())
    : locationDishes;

  const uniqueCategories = [...new Set(restaurantDishes.map(f => f.category))];

  const filtered = restaurantDishes.filter(f => {
    if (searchTerm && !f.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterFreeDelivery && !f.freeDelivery) return false;
    if (filterCategory !== "all" && f.category !== filterCategory) return false;
    if (filterType !== "all" && f.type.toLowerCase() !== filterType) return false;
    if (filterPrice !== "all") {
      const price = f.price;
      if (filterPrice === "0-300" && price > 300) return false;
      if (filterPrice === "300-600" && (price < 300 || price > 600)) return false;
      if (filterPrice === "600+" && price <= 600) return false;
    }
    return true;
  });

  const resetFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterPrice("all");
    setFilterType("all");
    setFilterFreeDelivery(false);
  };

  /* Scroll reveal */
  const cardsRef = useRef([]);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    cardsRef.current.forEach(el => {
      if (el) {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity .5s ease, transform .5s ease";
        obs.observe(el);
      }
    });
    return () => obs.disconnect();
  }, [filtered]);

  // Handle difficulty tag styling based on type (Veg, Non-Veg, Vegan)
  const getTypeClass = (type) => {
    const lowerType = type.toLowerCase();
    if (lowerType === "veg") return styles.easy;
    if (lowerType === "non-veg") return styles.challenging;
    if (lowerType === "vegan") return styles.moderate;
    return styles.easy;
  };

  return (
    <>
      {/* Page Hero */}
      <section className={styles.pageHero}>
        <div className={styles.container}>
          <h1>
            {restaurantName ? (
              <>Menu of <span className={styles.gradientText}>{restaurantName}</span></>
            ) : (
              <>Explore <span className={styles.gradientText}>Menu</span></>
            )}
          </h1>
          <p>
            {restaurantName 
              ? `Authentic dishes from ${restaurantName} delivered to your doorstep`
              : "Discover mouth-watering dishes crafted with the finest ingredients"}
          </p>
          
          <div className={styles.searchWrap}>
            <div className={styles.searchBar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input 
                type="text" 
                placeholder="Search for dishes..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.container}>
          <div className={styles.filterGroup}>
            <label>Category</label>
            <select className={styles.filterSelect} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              {uniqueCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Price</label>
            <select className={styles.filterSelect} value={filterPrice} onChange={e => setFilterPrice(e.target.value)}>
              <option value="all">Any Price</option>
              <option value="0-300">Under ₹300</option>
              <option value="300-600">₹300 – ₹600</option>
              <option value="600+">₹600+</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label>Type</label>
            <select className={styles.filterSelect} value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="veg">Veg</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                checked={filterFreeDelivery} 
                onChange={() => setFilterFreeDelivery(!filterFreeDelivery)} 
              />
              Free Delivery
            </label>
          </div>
          <button className={styles.filterReset} onClick={resetFilters}>Reset</button>
          <div className={styles.filterCount}>Showing <span>{filtered.length}</span> dishes</div>
        </div>
      </div>

      {/* Food Grid */}
      <section className={styles.menuSection}>
        <div className={styles.container}>
          <div className={styles.menuGrid}>
            {filtered.length === 0 ? (
              <div className={styles.noResults}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                <h3>No dishes found</h3>
                <p>Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              filtered.map((f, i) => (
                <div key={f.id} className={styles.menuCard} ref={el => cardsRef.current[i] = el}>
                  <div className={styles.imageWrap}>
                    <img src={f.image} alt={f.name} loading="lazy" />
                    <div className={styles.priceBadge}>₹{f.price.toLocaleString("en-IN")}</div>
                    {f.freeDelivery && <div className={styles.freeBadge}>Free Delivery</div>}
                    <div className={`${styles.difficultyBadge} ${getTypeClass(f.type)}`}>
                      {f.type}
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.tags}>
                      {(f.ingredients || []).slice(0, 3).map((tag, j) => (
                        <span key={j}>{tag}</span>
                      ))}
                    </div>
                    <h3>{f.name}</h3>
                    <p style={{fontSize: "0.85rem", color: "var(--text-2)", marginBottom: "12px", fontWeight: "600"}}>🏬 {f.restaurant}</p>
                    <div className={styles.meta}>
                      <div className={styles.metaItem}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>
                        {f.city}
                      </div>
                      <div className={styles.metaItem}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                        {f.prepTime}
                      </div>
                    </div>
                    <div className={styles.cardFooter}>
                      <div className={styles.rating}>
                        <svg viewBox="0 0 24 24" fill="#FBBF24" stroke="#FBBF24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                        {f.rating}
                      </div>
                      <button className={styles.viewBtn} onClick={() => navigate(`/food/${f.id}`)}>
                        View Details <span className={styles.arrow}>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Menu;
