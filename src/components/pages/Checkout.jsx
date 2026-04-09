import React, { useContext, useState } from 'react'
import { Container, Row, Col, Button, Card, Form, FloatingLabel } from 'react-bootstrap'
import { authContext } from '../context/AuthContext'
import { CartContext } from '../context/CartContext'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useNavigate } from 'react-router-dom'
import styles from './Checkout.module.css'

const Checkout = () => {
  const { user } = useContext(authContext)
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext)

  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    specialRequest: "",
  })

  const navigate = useNavigate()

  const subtotal = getCartTotal()
  const hasFreeDelivery = cartItems.some(item => item.freeDelivery);
  const deliveryFee = (subtotal > 0 && !hasFreeDelivery) ? 50 : 0
  const taxes = subtotal * 0.05
  const grandTotal = subtotal + deliveryFee + taxes;

  const handleChange = (identifier, e) => {
    setFormData((data) => ({
      ...data,
      [identifier]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (cartItems.length === 0) {
      alert("Your gourmet cart is empty!");
      return;
    }

    try {
      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        specialRequest: formData.specialRequest,
        items: cartItems.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
        subtotal,
        deliveryFee,
        taxes,
        grandTotal,
        status: "Confirmed",
        createdAt: serverTimestamp(),
      })

      alert("🎉 Order placed successfully!")
      if (clearCart) clearCart()
      navigate("/myorders")
    } catch (error) {
      console.log(error)
      alert("❌ Error placing order. Please try again.")
    }
  }

  if (cartItems.length === 0) {
    return (
      <Container className="mt-5">
        <Row>
          <Col>
            <Card className="shadow text-center py-5">
              <Card.Body>
                <h2>🍽️ Cart is Empty</h2>
                <p className="text-muted">You have no items in your gourmet cart to checkout.</p>
                <Button variant="primary" onClick={() => navigate("/menu")}>
                  ← Back to Menu
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    )
  }

  return (
    <>
      <section className={styles.heroSection}>
        <Container>
          <h1 className={styles.pageTitle}>Checkout</h1>
          <p className={styles.pageSubtitle}>Confirm your delivery details</p>
        </Container>
      </section>

      <section className={styles.formSection}>
        <Container>
          <Row className="g-5">
            {/* Order Summary */}
            <Col lg={5}>
              <Card className="shadow">
                <Card.Body>
                  <h3 style={{color: "var(--text-1)"}}>Order Summary</h3>
                  <hr/>
                  <div className="items-list my-3">
                    {cartItems.map(item => (
                      <div key={item.id} className="d-flex justify-content-between mb-2">
                        <span>{item.quantity}x {item.name}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <strong>₹{subtotal.toFixed(0)}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Delivery Fee</span>
                    <strong>₹{deliveryFee}</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Taxes & GST (5%)</span>
                    <strong>₹{taxes.toFixed(0)}</strong>
                  </div>
                  <hr/>
                  <div className="d-flex justify-content-between mb-2" style={{fontSize: "1.2rem"}}>
                    <span>Total Amount</span>
                    <strong>₹{grandTotal.toFixed(0)}</strong>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Checkout Form */}
            <Col lg={7}>
              <Card className="shadow">
                <Card.Body>
                  <h3 style={{color: "var(--text-1)", marginBottom: "20px"}}>📋 Delivery Details</h3>
                  
                  <Form onSubmit={handleSubmit}>
                    
                    <FloatingLabel label="Full Name" className="mb-3">
                      <Form.Control 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => handleChange("name", e)}
                        required
                      />
                    </FloatingLabel>

                    <FloatingLabel label="Email Address" className="mb-3">
                      <Form.Control 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => handleChange("email", e)}
                        required
                      />
                    </FloatingLabel>

                    <FloatingLabel label="Phone Number" className="mb-3">
                      <Form.Control 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e)}
                        placeholder="+91"
                        required
                      />
                    </FloatingLabel>

                    <FloatingLabel label="Delivery Address" className="mb-3">
                      <Form.Control 
                        as="textarea"
                        value={formData.address}
                        onChange={(e) => handleChange("address", e)}
                        style={{ height: '100px' }}
                        required
                      />
                    </FloatingLabel>

                    <FloatingLabel label="Special Instructions (Optional)" className="mb-3">
                      <Form.Control 
                        as="textarea"
                        value={formData.specialRequest}
                        onChange={(e) => handleChange("specialRequest", e)}
                        style={{ height: '80px' }}
                      />
                    </FloatingLabel>

                    <Button type='submit' className="w-100 py-3 mt-3" style={{ background: "linear-gradient(90deg, var(--accent-1), var(--accent-2))", border: "none", fontSize: "1.1rem", fontWeight: "bold" }}>
                      Submit Order
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default Checkout