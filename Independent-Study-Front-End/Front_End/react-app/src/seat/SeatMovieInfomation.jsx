import React from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Image } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import "./SeatPayment.css"

const MovieInfomation = ({ movieInfomation }) => {
  const isLargeScreen = useMediaQuery({ query: "(min-width: 768px)" });
  

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <h2 className="infocss">{movieInfomation.theaterName}</h2>
        </Col>
      </Row>
      <Row>
        <Col xs={6} md={3} lg={2}>
          <Image src={movieInfomation.movieImage} alt="MovieImage" fluid />
        </Col>
        <Col xs={6} md={9} lg={10}>
          <p className={isLargeScreen ? "movie-text" : null}>
            {movieInfomation.movieName}
          </p>
          <p className={isLargeScreen ? "movie-text" : null}>
            場次: {movieInfomation.showTime}
          </p>
          <p className={isLargeScreen ? "movie-text" : null}>
            廳: {movieInfomation.screen}
          </p>
          <p className={isLargeScreen ? "movie-text" : null}>
            座位: {movieInfomation.seat.join(" & ")}
          </p>
        </Col>
      </Row>
    </Container>
  );
};

MovieInfomation.propTypes = {
  movieInfomation: PropTypes.shape({
    theaterName: PropTypes.string.isRequired,
    movieName: PropTypes.string.isRequired,
    movieImage: PropTypes.string.isRequired,
    showTime: PropTypes.string.isRequired,
    screen: PropTypes.string.isRequired,
    seat: PropTypes.arrayOf(PropTypes.string).isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
};

export default MovieInfomation;
