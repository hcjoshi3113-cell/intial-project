import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button, Container, Row, Col } from 'react-bootstrap'
import styles from './Error.module.css'

const Error = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const errorCode = location.state?.statusCode || 404
    const errorMessage = location.state?.message || "Page Not Found"

    useEffect(() => {
        document.title = `Error ${errorCode} - TastyHub`
    }, [errorCode])

    const renderErrorIllustration = () => {
        switch(errorCode) {
            case 404:
                return '🍔'
            case 500:
                return '⚠️'
            case 403:
                return '🔒'
            default:
                return '❌'
        }
    }

    const getErrorDetails = () => {
        const details = {
            404: {
                title: "Page Not Found",
                description: "Oops! It looks like this page was cooked elsewhere. Let's get you back on track!",
                suggestion: "The page you're looking for might have moved or doesn't exist."
            },
            500: {
                title: "Server Error",
                description: "Something went wrong on our end. Don't worry, our team is on it!",
                suggestion: "Please try again in a few moments or contact support."
            },
            403: {
                title: "Access Forbidden",
                description: "You don't have permission to access this resource.",
                suggestion: "Make sure you're logged in with the correct account."
            }
        }
        return details[errorCode] || {
            title: "Oops! An Error Occurred",
            description: errorMessage,
            suggestion: "Something unexpected happened. Please try again."
        }
    }

    const errorDetails = getErrorDetails()

    return (
        <div className={styles.errorContainer}>
            <div className={styles.backgroundPattern}></div>
            
            <Container className={styles.container}>
                <Row className="align-items-center justify-content-center min-vh-100">
                    <Col xs={12} sm={10} md={8} lg={6}>
                        <div className={styles.errorContent}>
                            {/* Error Illustration */}
                            <div className={styles.illustration}>
                                <div className={styles.emoji}>
                                    {renderErrorIllustration()}
                                </div>
                                <div className={styles.errorCode}>
                                    {errorCode}
                                </div>
                            </div>

                            {/* Error Message */}
                            <h1 className={styles.title}>
                                {errorDetails.title}
                            </h1>
                            
                            <p className={styles.description}>
                                {errorDetails.description}
                            </p>

                            <p className={styles.suggestion}>
                                {errorDetails.suggestion}
                            </p>

                            {/* Action Buttons */}
                            <div className={styles.actions}>
                                <Button 
                                    onClick={() => navigate('/')}
                                    className={styles.primaryBtn}
                                >
                                    🏠 Back to Home
                                </Button>
                                
                                <Button 
                                    onClick={() => navigate(-1)}
                                    className={styles.secondaryBtn}
                                >
                                    ← Go Back
                                </Button>
                            </div>

                            {/* Help Text */}
                            <div className={styles.helpSection}>
                                <p className={styles.helpText}>
                                    Need help? <a href="/">Contact our support team</a>
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div className={styles.quickLinks}>
                                <h3 className={styles.quickLinksTitle}>Quick Links</h3>
                                <div className={styles.linkGrid}>
                                    <a href="/" className={styles.quickLink}>
                                        <span className={styles.icon}>🏠</span>
                                        Home
                                    </a>
                                    <a href="/restaurants" className={styles.quickLink}>
                                        <span className={styles.icon}>🍔</span>
                                        Find Restaurants
                                    </a>
                                    <a href="/about" className={styles.quickLink}>
                                        <span className={styles.icon}>ℹ️</span>
                                        About Us
                                    </a>
                                    <a href="/" className={styles.quickLink}>
                                        <span className={styles.icon}>📧</span>
                                        Support
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Error