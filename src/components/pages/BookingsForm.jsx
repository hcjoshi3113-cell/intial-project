import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { trips } from '../../data/tripsData'
import { Container, Row, Col, Button, Card, Badge, Form, FloatingLabel } from 'react-bootstrap'
import { authContext } from '../context/AuthContext'

const BookingsForm = () => {


  const { id } = useParams()

  const selectedTrips = trips.find((t) => t.id === Number(id))


  const { user } = useContext(authContext)


  console.log("user", user)

  const [formData, setFormData] = useState({
    name: user.displayName
  })


  const handleChange = (identifier, e) => {
    setFormData((data) => {
      return {
        ...data,
        [identifier]: e.target.value
      }
    })
  }


  console.log("new name", formData.name)


  if (!selectedTrips) {
    return (
      <Container>
        <Row>
          <Col>
            <Card className="shadow mt-5">
              <Card.Body>
                <Card.Title>Trips Detail not Found</Card.Title>
                <Button variant="primary" onClick={() => navigate(-1)} >Back To Trips</Button>
              </Card.Body>
            </Card></Col>
        </Row>
      </Container>
    )

  }



  return (
    <Container className='mt-5'>
      <Row>
        <Col md={6} >
          <Card className='shadow rounded-5' >
            <Card.Img variant="top" src={selectedTrips.image} className='rounded-5 shadow' style={{ height: "400px" }} />
            <Card.Body className='text-center'>
              <Card.Title>{selectedTrips.name}</Card.Title>
              <Card.Text>
                <h5 className="text-secondary" >{selectedTrips.destination}</h5>
                <div className="d-flex gap-1 justify-content-center align-items-center">
                  <Badge bg="primary" >{selectedTrips.duration}</Badge>
                  <Badge bg="secondary" >{selectedTrips.rating}</Badge>
                  <Badge bg="info" >{selectedTrips.difficulty}</Badge>
                  <Badge bg="success" > ₹{selectedTrips.price}</Badge>
                </div>
              </Card.Text>

            </Card.Body>
          </Card>



        </Col>
        <Col md={6} >

          <Form>

            <FloatingLabel
              controlId="floatingInput"
              label="Name"
              className="mb-3"
            >
              <Form.Control type="text" value={formData.name} onChange={(e) => handleChange("name", e)} />
            </FloatingLabel>
            <FloatingLabel controlId="floatingPassword" label="Password">
              <Form.Control type="password" placeholder="Password" />
            </FloatingLabel>
          </Form>

        </Col>
      </Row>
    </Container>
  )
}

export default BookingsForm