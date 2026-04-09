import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, googleAuth } from "../../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import styles from "./Auth.module.css";

const Auth = () => {
  const [authData, setAuthData] = useState({ email: "", password: "", displayName: "" });
  const [isSignup, setIsSignup] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pwStrength, setPwStrength] = useState({ level: "", label: "" });
  const navigate = useNavigate();

  const handleChange = (field, e) => {
    setAuthData(prev => ({ ...prev, [field]: e.target.value }));
    setError(null);
    if (field === "password" && isSignup) {
      const v = e.target.value;
      let score = 0;
      if (v.length >= 8) score++;
      if (/[A-Z]/.test(v)) score++;
      if (/[0-9]/.test(v)) score++;
      if (/[^A-Za-z0-9]/.test(v)) score++;
      if (v.length === 0) setPwStrength({ level: "", label: "" });
      else if (score <= 1) setPwStrength({ level: "weak", label: "Weak password" });
      else if (score <= 2) setPwStrength({ level: "medium", label: "Medium strength" });
      else setPwStrength({ level: "strong", label: "Strong password" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authData.email.trim() || !authData.password.trim() || (isSignup && !authData.displayName.trim())) {
      setError(isSignup && !authData.displayName.trim() ? "Name is required" : "All fields are required");
      return;
    }
    if (authData.password.length < 6) { setError("Password must be at least 6 characters"); return; }

    setIsLoading(true);
    setError(null);
    try {
      if (isSignup) {
        const result = await createUserWithEmailAndPassword(auth, authData.email, authData.password);
        if (result.user) { await updateProfile(result.user, { displayName: authData.displayName }); navigate("/"); }
      } else {
        await signInWithEmailAndPassword(auth, authData.email, authData.password);
        navigate("/");
      }
    } catch (err) {
      const msgs = {
        "auth/email-already-in-use": "Email already registered. Please sign in instead.",
        "auth/invalid-email": "Invalid email address.",
        "auth/weak-password": "Password should be at least 6 characters.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
      };
      setError(msgs[err.code] || "An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try { await signInWithPopup(auth, googleAuth); navigate("/"); }
    catch (err) { if (err.code !== "auth/popup-closed-by-user") setError("Failed to sign in with Google."); setIsLoading(false); }
  };

  const switchTab = (signup) => { setIsSignup(signup); setError(null); setAuthData({ email: "", password: "", displayName: "" }); setPwStrength({ level: "", label: "" }); };

  return (
    <>
      <Link to="/" className={styles.backLink}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        Back to Home
      </Link>

      <div className={styles.authWrapper}>
        {/* Decorative Left */}
        <div className={styles.authDeco}>
          <div className={styles.shape1}></div>
          <div className={styles.shape2}></div>
          <div className={styles.shape3}></div>
          <div className={styles.decoLogo}><span className={styles.decoIcon}>🍔</span> TastyHub</div>
          <div className={styles.decoIllustration}>🍕</div>
          <h2>Your Favorite Food Awaits</h2>
          <p>Join 50,000+ foodies discovering the best pure veg cuisines in your city.</p>
        </div>

        {/* Form Panel */}
        <div className={styles.authFormPanel} style={{ marginTop: "2rem" }}>
          <div className={styles.tabHeader}>
            <button className={`${styles.tabBtn} ${isSignup ? styles.tabActive : ""}`} onClick={() => switchTab(true)}>Create Account</button>
            <button className={`${styles.tabBtn} ${!isSignup ? styles.tabActive : ""}`} onClick={() => switchTab(false)}>Sign In</button>
          </div>

          {error && <div className={styles.errorAlert}><span>⚠️</span> {error}</div>}

          <form className={styles.authForm} onSubmit={handleSubmit} noValidate>
            {isSignup && (
              <div className={styles.inputGroup}>
                <input type="text" placeholder=" " value={authData.displayName} onChange={e => handleChange("displayName", e)} disabled={isLoading} required />
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <label>Full Name</label>
              </div>
            )}
            <div className={styles.inputGroup}>
              <input type="email" placeholder=" " value={authData.email} onChange={e => handleChange("email", e)} disabled={isLoading} required />
              <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              <label>Email Address</label>
            </div>
            <div className={styles.inputGroup}>
              <input type="password" placeholder=" " value={authData.password} onChange={e => handleChange("password", e)} disabled={isLoading} required />
              <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <label>Password</label>
            </div>
            {isSignup && (
              <>
                <div className={styles.pwStrength}><div className={`${styles.pwBar} ${styles[pwStrength.level]}`}></div></div>
                {pwStrength.label && <div className={styles.pwLabel}>{pwStrength.label}</div>}
              </>
            )}

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
              {isLoading ? (isSignup ? "Creating Account..." : "Signing In...") : (isSignup ? "Create Account" : "Sign In")}
            </button>

            <div className={styles.divider}>or continue with</div>

            <button type="button" className={styles.googleBtn} onClick={handleGoogleLogin} disabled={isLoading}>
              <svg viewBox="0 0 24 24" width="20" height="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
              Continue with Google
            </button>

            <div className={styles.authFooter}>
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <a href="#" onClick={e => { e.preventDefault(); switchTab(!isSignup); }}>{isSignup ? "Sign In" : "Create Account"}</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Auth;
