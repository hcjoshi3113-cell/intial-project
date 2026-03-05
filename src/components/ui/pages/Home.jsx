import Carousel from "react-bootstrap/Carousel";
import { Image } from "react-bootstrap";

function CarouselFadeExample() {
  return (
    <Carousel fade>
      <Carousel.Item>
        {/* <video controls autoPlay >
        <source src="../../../assets/video/tripVerse.mp4"  type='video/mp4' ></source>
       </video> */}

        <Image src="https://images.pexels.com/photos/1643403/pexels-photo-1643403.jpeg" />

        <Carousel.Caption>
          <h3>First slide label</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselFadeExample;
