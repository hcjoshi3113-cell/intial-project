import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LocationContext } from "../context/LocationContext";
import styles from "./Home.module.css";
import { foodList } from "../../data/foodData";

function Home() {
  const navigate = useNavigate();
  const { city } = useContext(LocationContext);
  const countersRef = useRef([]);
  const revealRef = useRef([]);

  /* ── Animated Counters ── */
  useEffect(() => {
    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.target);
      const isDecimal = target % 1 !== 0;
      const duration = 2000;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * target;
        if (isDecimal) el.textContent = current.toFixed(1);
        else if (target >= 1000) el.textContent = Math.floor(current).toLocaleString("en-IN") + "+";
        else el.textContent = Math.floor(current) + "+";
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); }
      });
    }, { threshold: 0.5 });

    countersRef.current.forEach((c) => c && obs.observe(c));
    return () => obs.disconnect();
  }, []);

  /* ── Scroll reveal ── */
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

    revealRef.current.forEach((el) => {
      if (el) {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity .6s ease, transform .6s ease";
        obs.observe(el);
      }
    });
    return () => obs.disconnect();
  }, []);

  /* ── Parallax hero ── */
  useEffect(() => {
    const handleScroll = () => {
      const s = window.scrollY;
      if (s < window.innerHeight) {
        const bg = document.querySelector(`.${styles.heroBgImg}`);
        if (bg) bg.style.transform = `translateY(${s * 0.3}px) scale(1.1)`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  let revealIdx = 0;

  const locationDishes = city === 'All' ? foodList : foodList.filter(d => d.city === city);
  const popularDishes = locationDishes.slice(0, 6);

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <img className={styles.heroBgImg} src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg" alt="Delicious Food" />
        </div>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContainer}>
          <div className={styles.heroBadge}>
            <span className={styles.pulse}></span> 100% Pure Vegetarian Experience
          </div>
          <h1 className={styles.heroTitle}>
            Discover Your Next<br />
            <span className={styles.accent}>Delicious Meal</span>
          </h1>
          <p className={styles.heroDesc}>
            Curated culinary experiences from the best chefs. Fresh ingredients, mouth-watering flavors, and fast delivery right to your door.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.btnPrimary} onClick={() => navigate("/restaurants")}>
              Find Restaurants
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
            <button className={styles.btnSecondary} onClick={() => navigate("/restaurants")}>Browse All</button>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <div className={styles.statNumber} data-target="200" ref={el => countersRef.current[0] = el}>0</div>
              <div className={styles.statLabel}>Unique Dishes</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.statNumber} data-target="50000" ref={el => countersRef.current[1] = el}>0</div>
              <div className={styles.statLabel}>Happy Foodies</div>
            </div>
            <div className={styles.heroStat}>
              <div className={styles.statNumber} data-target="4.8" ref={el => countersRef.current[2] = el}>0</div>
              <div className={styles.statLabel}>Average Rating</div>
            </div>
          </div>
        </div>
        <div className={styles.heroScroll}>
          <span>Scroll Down</span>
          <div className={styles.scrollArrow}></div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className={styles.whySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionLabel}><span className={styles.dot}></span> Why TastyHub</div>
            <h2 className={styles.sectionTitle}>Why Foodies <span className={styles.gradientText}>Choose Us</span></h2>
            <p className={styles.sectionSubtitle}>We craft unforgettable dining experiences with attention to fresh ingredients, taste, and speedy delivery.</p>
          </div>
          <div className={styles.whyGrid}>
            {[
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>, title: "Pure Veg Quality", desc: "A strictly 100% vegetarian kitchen ensuring zero cross-contamination and the highest Sattvic standards." },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></svg>, title: "Authentic Flavors", desc: "Traditional recipes passed down through generations, crafted with premium ghee and fresh local produce." },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>, title: "Verified Chefs", desc: "Our chefs specialize in Gujarati and North Indian vegetarian cuisines with over 15+ years of expertise." },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 6v6l4 2" /></svg>, title: "Lightning Fast", desc: "Dedicated delivery fleet that ensures your meal arrives piping hot within 30 minutes of preparation." },
            ].map((card, i) => (
              <div key={i} className={styles.whyCard} ref={el => revealRef.current[revealIdx++] = el}>
                <div className={styles.iconWrap}>{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ POPULAR DISHES ═══ */}
      <section className={styles.destSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionLabel}><span className={styles.dot}></span> Local Specialties</div>
            <h2 className={styles.sectionTitle}>Must-Try <span className={styles.gradientText}>Flavors</span></h2>
            <p className={styles.sectionSubtitle}>Discover the most iconic dishes in {city === 'All' ? 'Gujarat' : city}.</p>
          </div>
          <div className={styles.destGrid}>
            {popularDishes.map((dish, i) => (
              <div key={i} className={styles.destCard} ref={el => revealRef.current[revealIdx++] = el}>
                <img src={dish.image} alt={dish.name} loading="lazy" />
                <div className={styles.destOverlay}></div>
                <div className={styles.destContent}>
                  <span className={styles.destTag}>{dish.category}</span>
                  <h3>{dish.name}</h3>
                  <div className={styles.destMeta}>
                    <span>{dish.type}</span><span>•</span><span>{dish.prepTime}</span>
                  </div>
                  <div className={styles.destPrice}>₹{dish.price}</div>
                  <span className={styles.exploreLink} onClick={() => navigate(`/food/${dish.id}`)}>
                    View Dish <span className={styles.arrow}>→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaBanner} ref={el => revealRef.current[revealIdx++] = el}>
            <h2>Ready to Enjoy a <span className={styles.gradientText}>Feast</span>?</h2>
            <p>Join over 50,000 foodies who have discovered their favorite restaurants with TastyHub.</p>
            <button className={styles.btnPrimary} onClick={() => navigate("/restaurants")}>
              Select Restaurant
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
