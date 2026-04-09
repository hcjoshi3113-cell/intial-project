import { useState, useContext } from "react";
import { Container, Row, Col, Image, Card, Button, Badge, ListGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { foodList } from "../../data/foodData";
import { CartContext } from "../context/CartContext";
import styles from "./FoodDetail.module.css";

const FoodDetail = () => {
  const { id } = useParams();
  const food = foodList.find((t) => t.id === Number(id));
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(food, quantity);
    // Optional: add a toast or transition to cart directly
    navigate('/cart');
  };

  if (!food) {
    return (
      <Container className="mt-5">
        <Row>
          <Col>
            <Card className={`${styles.notFoundCard} shadow`}>
              <Card.Body className="text-center py-5">
                <h2 className="mb-3">📍 Meal Not Found</h2>
                <p className="text-muted mb-4">The dish you're looking for doesn't exist.</p>
                <Button variant="primary" onClick={() => navigate("/restaurants")}>
                  ← Back to Menu
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  // Determine badge styling based on type
  const getTypeBadge = (type) => {
    const lowerType = type.toLowerCase();
    if (lowerType === "veg") return "success";
    if (lowerType === "non-veg") return "danger";
    if (lowerType === "vegan") return "warning";
    return "primary";
  };

  return (
    <>
      <section className={styles.heroSection}>
        <Image src={food.image} className={styles.heroImage} alt={food.name} />
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <Container>
            <Button 
              className={styles.backBtn}
              onClick={() => navigate("/restaurants")}
            >
              ← Back
            </Button>
            <h1 className={styles.heroTitle}>{food.name}</h1>
            <p className={styles.heroLocation}>🏬 {food.restaurant} • 🍽️ {food.category}</p>
            <div className={styles.badges}>
              <Badge bg={getTypeBadge(food.type)} className={styles.badge}>{food.type}</Badge>
              <Badge bg="info" className={styles.badge}>⭐ {food.rating}</Badge>
              <Badge bg="secondary" className={styles.badge}>⏱ {food.prepTime}</Badge>
            </div>
          </Container>
        </div>
      </section>

      <section style={{ padding: 'calc(8px * 12) 0' }}>
        <Container>
          <Row className="g-5">
          <Col lg={8}>
            {/* Overview Section */}
            <Card className={styles.section}>
              <Card.Body>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>✨ Overview</h3>
                </div>
                <p className={styles.sectionText}>{food.overview}</p>
              </Card.Body>
            </Card>

            {/* Ingredients Section */}
            <Card className={styles.section}>
              <Card.Body>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>🥬 Key Ingredients</h3>
                </div>
                <ListGroup variant="flush" className={styles.highlightsList}>
                  {(food.ingredients || []).map((ingredient, idx) => (
                    <ListGroup.Item key={idx} className={styles.highlightItem}>
                      <span className={styles.highlightIcon}>✓</span>
                      {ingredient}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
            
          </Col>

          {/* Add To Cart Sidebar */}
          <Col lg={4}>
            <Card className={`${styles.bookingCard} sticky-lg-top`}>
              <Card.Body>
                <div className={styles.priceBox}>
                  <span className={styles.priceLabel}>Price</span>
                  <h2 className={styles.priceValue}>₹{food.price.toLocaleString('en-IN')}</h2>
                  <p className={styles.priceNote}>Per serving</p>
                </div>

                <div className={styles.tripInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>⏱</span>
                    <div>
                      <p className={styles.infoLabel}>Prep Time</p>
                      <p className={styles.infoValue}>{food.prepTime}</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>🍽️</span>
                    <div>
                      <p className={styles.infoLabel}>Category</p>
                      <p className={styles.infoValue}>{food.category}</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>🏬</span>
                    <div>
                      <p className={styles.infoLabel}>Restaurant</p>
                      <p className={styles.infoValue}>{food.restaurant}</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoIcon}>⭐</span>
                    <div>
                      <p className={styles.infoLabel}>Rating</p>
                      <p className={styles.infoValue}>{food.rating}/5.0</p>
                    </div>
                  </div>
                </div>

                {/* Quantity Control */}
                <div className={styles.quantityWrapper}>
                  <p className={styles.infoLabel} style={{marginBottom: "8px"}}>Quantity</p>
                  <div className={styles.quantityControls}>
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className={styles.qtyBtn}
                    >
                      -
                    </button>
                    <span className={styles.qtyValue}>{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className={styles.qtyBtn}
                    >
                      +
                    </button>
                  </div>
                  <p className={styles.totalCalc}>Total: ₹{(food.price * quantity).toLocaleString('en-IN')}</p>
                </div>

                <div className={`d-grid gap-2 ${styles.buttonGroup}`}>
                  <Button 
                    className={styles.bookBtn}
                    onClick={handleAddToCart}
                  >
                    🛒 Add to Cart
                  </Button>
                </div>

                <p className={styles.trustText}>
                  ✓ Fresh guaranteed • Fast delivery • Rated 5-stars
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      </section>
    </>
  );
};

export default FoodDetail;
