import { Container, Row, Col, Image, Card, Button, Badge, ListGroup, Accordion } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { trips } from "../../data/tripsData";
import { useContext } from "react";
import { authContext } from "../context/AuthContext";

const TripDetail = () => {
  const { id } = useParams();

  const trip = trips.find((t) => t.id === Number(id));


  const navigate = useNavigate()


  const { user } = useContext(authContext)

  console.log("check-user", user)

  const handleBook = () => {

    try {


      if (!user) {

        navigate("/auth")

      } else {
        navigate(`/booking/${id}`)
      }


    } catch (error) {

    }
  }

  if (!trip) {
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
    <>

      <Container>
        <Row className="mt-3">
          <Col >
            <Image src={trip.image} className="rounded-5 shadow" style={{ height: "450px", width: "100%", objectFit: "cover" }} ></Image>
          </Col>
        </Row>

        <Row className="mt-3" >
          <Col lg={8} >
            <h1>{trip.name}</h1>
            <h5 className="text-secondary" >{trip.destination}</h5>
            <div className="d-flex gap-1">
              <Badge bg="primary" >{trip.duration}</Badge>
              <Badge bg="secondary" >{trip.rating}</Badge>
              <Badge bg="info" >{trip.difficulty}</Badge>
              <Badge bg="success" > ₹{trip.price}</Badge>
            </div>

            <Row className="mt-3" >
              <Col>
                <Card className="p-3 shadow" >
                  <h5>Overview</h5>
                  <p>{trip.overview}</p>
                </Card>

              </Col>
            </Row>

            <Row className="mt-3" >
              <Col>
                <Card className="p-3" >
                  <h5>Trip Highlights</h5>
                  <ListGroup className="mt-2" variant="flush" >
                    {trip.highlights.map((highLight) => (
                      <ListGroup.Item> ✅{highLight} </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>


              </Col>
            </Row>

            <Row className="mt-3" >
              <Col>
                <Card className="p-3" >
                  <h5>Day-wise itinerary</h5>
                  <Accordion flush>

                    {trip.itinerary.map((a) => (

                      <>
                        <Accordion.Item eventKey={a.day}>
                          <Accordion.Header>{a.day}-{a.title}</Accordion.Header>
                          <Accordion.Body>
                            {a.description}
                          </Accordion.Body>
                        </Accordion.Item>

                      </>
                    ))}
                  </Accordion>
                </Card>


              </Col>
            </Row>

            <Row className="mt-3">
              <Col lg={6}>
                <Card className="p-3" >
                  <h5>Inclusion</h5>
                  <ListGroup className="mt-2" variant="flush" >
                    {trip.inclusions.map((inclusions) => (
                      <ListGroup.Item> ✅{inclusions} </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>

              </Col>
              <Col lg={6}>
                <Card className="p-3" >
                  <h5>exclusions</h5>
                  <ListGroup className="mt-2" variant="flush" >
                    {trip.exclusions.map((exclusions) => (
                      <ListGroup.Item> ✖️{exclusions} </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card></Col>
            </Row>

            <Row className="mt-3" >
              <Col>
                <Card className="p-3">
                  <h5>Best Time To Visit</h5>
                  <p>{trip.bestTimeToVisit}</p>
                </Card>
              </Col>
            </Row>

            <Button onClick={() => navigate(-1)} className="mt-3" variant="outline-secondary"> 🔙 Back to trips</Button>


          </Col>

          <Col lg={4}  >
            <Card className="p-3 shadow sticky-top" style={{ top: "50px" }}>
              <h3>₹{trip.price}</h3>
              <h6>{trip.duration} - {trip.difficulty}</h6>
              <div className="d-grid gap-2">
                <Button variant="primary" onClick={handleBook}   >
                  Book now
                </Button>

                <Button variant="outline-secondary" >
                  inquiry now
                </Button>
              </div>

            </Card></Col>

        </Row>
      </Container>


    </>
  );
};

export default TripDetail;
