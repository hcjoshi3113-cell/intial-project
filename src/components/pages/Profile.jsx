import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import styles from "./Profile.module.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useContext(authContext);
  const [settings, setSettings] = useState({
    emailNotif: true, sms: false, twoFactor: false, location: true,
  });

  const panelsRef = useRef([]);

  /* Scroll reveal */
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.style.opacity = "1"; e.target.style.transform = "translateY(0)"; obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    panelsRef.current.forEach(p => {
      if (p) { p.style.opacity = "0"; p.style.transform = "translateY(20px)"; p.style.transition = "opacity .5s ease, transform .5s ease"; obs.observe(p); }
    });
    return () => obs.disconnect();
  }, []);

  if (!user) {
    return (
      <div className={styles.notLoggedIn}>
        <h2>🔐 Please Log In</h2>
        <p>You need to be logged in to view your profile.</p>
        <button className={styles.btnPrimary} onClick={() => navigate("/auth")}>Sign In Now</button>
      </div>
    );
  }

  const initials = user.displayName ? user.displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deletion requested. Our team will process this within 48 hours.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  let pi = 0;

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileLayout}>
        {/* SIDEBAR PROFILE CARD */}
        <aside className={styles.profileCard}>
          <div className={styles.profileBanner}></div>
          <div className={styles.avatarWrap}>
            <div className={styles.avatarRing}>
              <div className={styles.avatar}>{initials}</div>
            </div>
          </div>
          <div className={styles.profileInfo}>
            <h2>{user.displayName || "User"}</h2>
            <div className={styles.email}>{user.email}</div>
            <div className={styles.profileStats}>
              <span className={styles.statPill}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                Jan 2024
              </span>
              <span className={styles.statPill}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>
                12 Orders
              </span>
            </div>
          </div>
          <div className={styles.quickLinks}>
            <a href="#account" className={styles.quickLink}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              Account Info
            </a>
            <a href="#settings" className={styles.quickLink}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09z" /></svg>
              Settings
            </a>
            <Link to="/restaurants" className={styles.quickLink}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              Browse Menu
            </Link>
            <button onClick={handleLogout} className={`${styles.quickLink} ${styles.logoutLink}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              Log Out
            </button>
          </div>
        </aside>

        {/* CONTENT PANELS */}
        <div className={styles.contentPanels}>
          {/* Account Info */}
          <div className={styles.panel} id="account" ref={el => panelsRef.current[pi++] = el}>
            <div className={styles.panelHeader}>
              <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                Account Information
              </h3>
              <button className={styles.editBtn}>Edit Profile</button>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}><label>Full Name</label><div className={styles.value}>{user.displayName || "Not set"}</div></div>
              <div className={styles.infoItem}><label>Email</label><div className={styles.value}>{user.email}</div></div>
              <div className={styles.infoItem}><label>Phone</label><div className={styles.value}>+91 98765 43210</div></div>
              <div className={styles.infoItem}><label>Location</label><div className={styles.value}>Mumbai, India</div></div>
              <div className={styles.infoItem}><label>Date of Birth</label><div className={styles.value}>15 March 2000</div></div>
              <div className={styles.infoItem}><label>Gender</label><div className={styles.value}>Male</div></div>
            </div>
          </div>

          {/* Settings */}
          <div className={styles.panel} id="settings" ref={el => panelsRef.current[pi++] = el}>
            <div className={styles.panelHeader}>
              <h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09z" /></svg>
                Settings
              </h3>
            </div>
            {[
              { key: "emailNotif", title: "Email Notifications", desc: "Receive updates about orders and offers" },
              { key: "sms", title: "SMS Alerts", desc: "Get delivery reminders via SMS" },
              { key: "twoFactor", title: "Two-Factor Authentication", desc: "Add extra security to your account" },
              { key: "location", title: "Location Sharing", desc: "Share your location for accurate delivery" },
            ].map(s => (
              <div key={s.key} className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
                <label className={styles.toggle}>
                  <input type="checkbox" checked={settings[s.key]} onChange={() => handleToggle(s.key)} />
                  <span className={styles.slider}></span>
                </label>
              </div>
            ))}
          </div>

          {/* Danger Zone */}
          <div className={`${styles.panel} ${styles.dangerZone}`} id="danger" ref={el => panelsRef.current[pi++] = el}>
            <div className={styles.panelHeader}>
              <h3 className={styles.dangerTitle}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                Danger Zone
              </h3>
            </div>
            <p className={styles.dangerText}>Once you delete your account, there is no going back. All your order data, bookings, and preferences will be permanently removed.</p>
            <button className={styles.deleteBtn} onClick={handleDelete}>Delete My Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
