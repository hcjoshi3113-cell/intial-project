import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./About.module.css";

function About() {
  const navigate = useNavigate();
  const countersRef = useRef([]);
  const revealRef = useRef([]);

  /* Animated Counters */
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
      entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.5 });

    countersRef.current.forEach(c => c && obs.observe(c));
    return () => obs.disconnect();
  }, []);

  /* Scroll Reveal */
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.style.opacity = "1"; e.target.style.transform = "translateY(0)"; obs.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

    revealRef.current.forEach(el => {
      if (el) { el.style.opacity = "0"; el.style.transform = "translateY(24px)"; el.style.transition = "opacity .5s ease, transform .5s ease"; obs.observe(el); }
    });
    return () => obs.disconnect();
  }, []);

  let ri = 0;
  const team = [
    { initials: "AR", name: "Aarav Rajan", role: "Founder & CEO", short: "Ex-FoodDash, 10+ years in culinary and tech.", long: "Aarav founded TastyHub after realising India's food delivery industry deserved a modern, tech-first approach that never sacrifices quality." },
    { initials: "PM", name: "Priya Menon", role: "Head of Operations", short: "Logistics expert, managed 10,000+ daily orders.", long: "Priya ensures every TastyHub delivery runs like clockwork — from kitchen coordination to rider support." },
    { initials: "VK", name: "Vikram Kapoor", role: "Lead Developer", short: "Full-stack wizard, built the entire TastyHub platform.", long: "Vikram combines his love of code and food to build intuitive tools that make discovering dishes effortless." },
    { initials: "NS", name: "Neha Sharma", role: "Creative Director", short: "Food photographer turned brand strategist.", long: "Neha crafts the visual identity of TastyHub, ensuring every touchpoint inspires the foodie within." },
  ];

  return (
    <>
      {/* Hero */}
      <section className={styles.aboutHero}>
        <div className={styles.container}>
          <h1>About <span className={styles.gradientText}>TastyHub</span></h1>
          <p>We're on a mission to make extraordinary food accessible through curated menus, expert chefs, and unmatched delivery speed.</p>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {[
              { icon: "🍔", target: "500", label: "Unique Dishes" },
              { icon: "😊", target: "50000", label: "Happy Foodies" },
              { icon: "⭐", target: "4.9", label: "Avg Rating" },
              { icon: "🏆", target: "15", label: "Culinary Awards" },
            ].map((s, i) => (
              <div key={i} className={styles.statCard} ref={el => revealRef.current[ri++] = el}>
                <div className={styles.statIcon}>{s.icon}</div>
                <div className={styles.statNumber} data-target={s.target} ref={el => countersRef.current[i] = el}>0</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={styles.mvSection}>
        <div className={styles.container}>
          <div className={styles.mvGrid}>
            <div className={styles.mvCard} ref={el => revealRef.current[ri++] = el}>
              <div className={styles.mvIcon}>🎯</div>
              <h3>Our Mission</h3>
              <p>To democratize premium culinary experiences by connecting curious foodies with India's most mouth-watering dishes. We believe every meal should be delicious, affordable, and crafted with care.</p>
            </div>
            <div className={styles.mvCard} ref={el => revealRef.current[ri++] = el}>
              <div className={styles.mvIcon}>🔭</div>
              <h3>Our Vision</h3>
              <p>To become India's most trusted food platform where technology meets gastronomy. We envision a world where ordering your dream meal is as seamless as craving it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.sectionLabel}><span className={styles.dot}></span> Our Values</div>
            <h2 className={styles.sectionTitle}>What We <span className={styles.gradientText}>Stand For</span></h2>
          </div>
          <div className={styles.valuesGrid}>
            {[
              { emoji: "🤝", title: "Trust & Transparency", desc: "No hidden fees, no surprises. We practice radical honesty in pricing, ingredients details, and customer communication." },
              { emoji: "🌱", title: "Fresh Ingredients", desc: "We champion responsible sourcing. Every meal supports local farmers and guarantees fresh, high-quality ingredients." },
              { emoji: "✨", title: "Excellence", desc: "From hand-picked recipes to expert chefs, every detail is curated for an experience that exceeds expectations — every single bite." },
              { emoji: "💡", title: "Innovation", desc: "We leverage cutting-edge technology to simplify food ordering while keeping the human touch that makes eating memorable." },
            ].map((v, i) => (
              <div key={i} className={styles.valueCard} ref={el => revealRef.current[ri++] = el}>
                <h4><span>{v.emoji}</span> {v.title}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.sectionLabel}><span className={styles.dot}></span> Our Team</div>
            <h2 className={styles.sectionTitle}>The <span className={styles.gradientText}>People</span> Behind TastyHub</h2>
          </div>
          <div className={styles.teamGrid}>
            {team.map((m, i) => (
              <div key={i} className={styles.teamCard} ref={el => revealRef.current[ri++] = el}>
                <div className={styles.teamAvatar}>{m.initials}</div>
                <h4>{m.name}</h4>
                <div className={styles.role}>{m.role}</div>
                <p>{m.short}</p>
                <div className={styles.teamOverlay}>
                  <h4>{m.name}</h4>
                  <div className={styles.role}>{m.role}</div>
                  <p>{m.long}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Checklist */}
      <section className={styles.checklistSection}>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.sectionLabel}><span className={styles.dot}></span> Why Choose Us</div>
            <h2 className={styles.sectionTitle}>The TastyHub <span className={styles.gradientText}>Difference</span></h2>
          </div>
          <div className={styles.checklist}>
            {[
              { title: "Verified Kitchens & Hygiene", desc: "Every partner kitchen is strictly inspected by our team for top-notch hygiene." },
              { title: "Lightning Fast Delivery", desc: "Hot food, delivered straight to your door in record time." },
              { title: "Curated Selections", desc: "Only the best dishes from top-rated restaurants and home chefs." },
              { title: "All-Inclusive Pricing", desc: "Food, taxes, and minimal delivery fees — all shown transparently at checkout." },
              { title: "Customer Support First", desc: "24/7 dedicated support to resolve any issues with your orders immediately." },
            ].map((item, i) => (
              <div key={i} className={styles.checkItem} ref={el => revealRef.current[ri++] = el}>
                <div className={styles.checkIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-1)" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.aboutCta}>
        <div className={styles.container}>
          <div className={styles.ctaBanner}>
            <h2>Ready to <span className={styles.gradientText}>Satisfy Your Cravings</span>?</h2>
            <p>Start exploring our mouth-watering menu today.</p>
            <button className={styles.btnPrimary} onClick={() => navigate("/menu")}>Explore Menu →</button>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;