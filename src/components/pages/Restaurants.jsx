import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { foodList } from "../../data/foodData";
import { LocationContext } from "../context/LocationContext";
import styles from "./Restaurants.module.css";

function Restaurants() {
  const navigate = useNavigate();
  const { city } = useContext(LocationContext);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const q = searchParams.get("search");
    if (q !== null) setSearchTerm(q);
  }, [searchParams]);
  const revealRef = useRef([]);

  // Extract unique restaurants grouped by city
  const getGroupedRestaurants = () => {
    const list = city === "All" ? foodList : foodList.filter(f => f.city === city);
    
    // Get unique restaurants
    const uniqueResNames = [...new Set(list.map(f => f.restaurant))];
    const uniqueRestaurants = uniqueResNames.map(name => {
      const sample = foodList.find(f => f.restaurant === name);
      return { 
        name, 
        category: sample.category, 
        rating: sample.rating, 
        image: sample.image, 
        city: sample.city 
      };
    }).filter(r => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (city !== "All") return { [city]: uniqueRestaurants };

    // Group by city
    const grouped = {};
    uniqueRestaurants.forEach(res => {
      if (!grouped[res.city]) grouped[res.city] = [];
      grouped[res.city].push(res);
    });
    return grouped;
  };

  const groupedRestaurants = getGroupedRestaurants();
  const sortedCities = Object.keys(groupedRestaurants).sort();

  /* Scroll reveal */
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
    revealRef.current.forEach(el => {
      if (el) {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity .5s ease, transform .5s ease";
        obs.observe(el);
      }
    });
    return () => obs.disconnect();
  }, [sortedCities]);

  return (
    <div className={styles.restaurantsPage}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1>Restaurants in <span className={styles.gradientText}>{city === "All" ? "Gujarat" : city}</span></h1>
          <p>Discover the best places to eat in your city</p>
          
          <div className={styles.searchContainer}>
            <div className={styles.searchBar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input 
                type="text" 
                placeholder="Search for restaurants or cuisines..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className={styles.searchBtn}>Search</button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.listSection}>
        <div className={styles.container}>
          {sortedCities.length === 0 ? (
            <div className={styles.noResults}>
               <div className={styles.noResultsIcon}>🍽️</div>
               <h3>No restaurants found</h3>
               <p>Try searching for a different name or switching cities.</p>
               <button className={styles.btnPrimary} onClick={() => navigate("/")}>Change City</button>
            </div>
          ) : (
            sortedCities.map((cityName, cityIdx) => (
              <div key={cityName} className={styles.citySection}>
                <h2 className={styles.cityHeader}>
                  <span className={styles.cityIcon}>📍</span> {cityName}
                </h2>
                <div className={styles.restaurantGrid}>
                  {groupedRestaurants[cityName].map((res, i) => (
                    <div 
                      key={res.name} 
                      className={styles.resCard} 
                      ref={el => revealRef.current[cityIdx * 100 + i] = el}
                      onClick={() => navigate(`/restaurant/${res.name}`)}
                    >
                      <div className={styles.imageWrap}>
                        <img src={res.image} alt={res.name} />
                        <div className={styles.ratingBadge}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                          {res.rating}
                        </div>
                      </div>
                      <div className={styles.resInfo}>
                        <h3>{res.name}</h3>
                        <p className={styles.category}>{res.category}</p>
                        <div className={styles.resFooter}>
                          <span className={styles.viewLink}>View Menu <span>→</span></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Restaurants;
