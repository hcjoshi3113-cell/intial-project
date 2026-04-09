import { Outlet } from 'react-router-dom'
import Navbar from "../components/ui/Navbar"
import Footer from "../components/ui/Footer"
import FloatingCart from "../components/ui/FloatingCart"
import styles from "./MainLayout.module.css"

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <FloatingCart />
      <Footer />
    </>
  )
}

export default MainLayout