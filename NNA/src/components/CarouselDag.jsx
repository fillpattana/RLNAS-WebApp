import Carousel from "react-bootstrap/Carousel";
import DAGSugi from "./DAGSugi";

function CarouselDag() {
  return (
    <Carousel data-bs-theme="dark">
      <Carousel.Item>
        <DAGSugi />
        <Carousel.Caption>
          <h5>Graph Visualization</h5>
          <p>Interactive DAG with Sugiyama layout.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <DAGSugi />
        <Carousel.Caption>
          <h5>A second iteration of the DAG</h5>
          <p></p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselDag;
