import React, { useContext, useEffect, useState } from 'react'
import { authContext } from '../context/AuthContext'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import styles from './MyOrders.module.css'

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const { user } = useContext(authContext)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      if (!user) {
        return
      }

      const fetchOrders = async () => {
        const q = query(
          collection(db, "bookings"),
          where("userId", "==", user.uid)
        )

        const snapshot = await getDocs(q)

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))

        data.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        });

        setOrders(data)
      }

      fetchOrders()
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }, [user])

  return (
    <>
      <section className={styles.heroSection}>
        <Container>
          <h1 className={styles.pageTitle}>My Orders</h1>
          <p className={styles.pageSubtitle}>Manage and view all your food orders</p>
        </Container>
      </section>

      <section className={styles.listSection}>
        <Container>
          {orders.length === 0 ? (
            <Row>
              <Col lg={8} className="mx-auto">
                <Card className={styles.emptyCard}>
                  <Card.Body className={styles.emptyBody} style={{ textAlign: "center", padding: "40px" }}>
                    <div className={styles.emptyIcon} style={{ fontSize: "3rem" }}>🍔</div>
                    <h2 className={styles.emptyTitle}>No Orders Yet</h2>
                    <p className={styles.emptyText}>
                      You haven't ordered any food yet. Start exploring our amazing menu today!
                    </p>
                    <Button
                      style={{ background: "linear-gradient(135deg, var(--accent-1), var(--accent-2))", border: "none", padding: "10px 24px", borderRadius: "30px", marginTop: "15px" }}
                      onClick={() => navigate("/restaurants")}
                    >
                      Browse Menu
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <div>
              <h2 className={styles.bookingsCount} style={{ marginBottom: "30px" }}>
                📌 {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
              </h2>
              <Row className="g-4">
                {orders.map((order) => (
                  <Col key={order.id} md={6} lg={4}>
                    <Card className="shadow h-100" style={{ borderRadius: "16px", border: "none" }}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h4 style={{ fontWeight: "700", color: "var(--text-1)", margin: 0 }}>Order #{order.id.slice(0, 6)}</h4>
                          <span style={{ background: "rgba(255,126,103,0.1)", color: "var(--accent-1)", padding: "4px 12px", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "600" }}>
                            {order.status || "Confirmed"}
                          </span>
                        </div>

                        <div style={{ background: "var(--bg-1)", padding: "15px", borderRadius: "12px", marginBottom: "20px" }}>
                          <p style={{ fontSize: "0.9rem", color: "var(--text-2)", marginBottom: "10px" }}><strong>Address:</strong> {order.address}</p>
                          <hr style={{ margin: "10px 0", opacity: 0.1 }} />
                          {order.items && order.items.length > 0 ? (
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                              {order.items.map((item, index) => (
                                <li key={index} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.95rem", marginBottom: "6px" }}>
                                  <span>{item.quantity}x {item.name}</span>
                                  <span style={{ fontWeight: "600" }}>₹{item.price * item.quantity}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ fontStyle: "italic", fontSize: "0.9rem", color: "var(--text-3)" }}>Items details unavailable</p>
                          )}
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span style={{ fontSize: "0.95rem", color: "var(--text-2)" }}>Total Amount</span>
                          <span style={{ fontSize: "1.2rem", fontWeight: "700", color: "var(--text-1)" }}>
                            ₹{order.grandTotal ? order.grandTotal.toLocaleString('en-IN') : 0}
                          </span>
                        </div>

                        <Button
                          variant="outline-primary"
                          className="w-100 mt-2"
                          size="sm"
                          style={{ borderRadius: "8px", padding: "8px", borderColor: "var(--accent-2)", color: "var(--accent-2)" }}
                        >
                          📞 Contact Support
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}

export default MyOrders