import React, { useContext, useEffect } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { BookingContext } from "../Context/BookingContext";
import { useParams, useNavigate } from "react-router-dom";
import "./order.css";

const MovieInfomation = () => {
  const { movieId } = useParams();
  const { bookingData } = useContext(BookingContext);
  const isLargeScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const navigate = useNavigate();

  // 調整日期呈現格式為"yyyy/mm/dd hh:mm"
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDate = date.toISOString().split("T")[0].replace(/-/g, "/");
    const formattedTime = date.toTimeString().split(" ")[0].substring(0, 5);
    return `${formattedDate} ${formattedTime}`;
  };

  useEffect(() => {
    if (!bookingData || !bookingData.showTime) {
      navigate(`/booking/${movieId}`);
    }
  }, [bookingData, movieId, navigate]);

  if (!bookingData || !bookingData.showTime) {
    return null;
  }

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <h2>{bookingData.theaterName}</h2>
        </Col>
      </Row>
      <Row>
        <Col xs={6} md={3} lg={2}>
          <Image src={bookingData.poster} alt="MovieImage" fluid />
        </Col>
        <Col xs={6} md={9} lg={10}>
          <p className={isLargeScreen ? "movie-text" : null}>
            {bookingData.title}
          </p>
          <p className={isLargeScreen ? "movie-text" : null}>
            場次: {formatDateTime(bookingData.showTime)}
          </p>
          <p className={isLargeScreen ? "movie-text" : null}>
            廳: {bookingData.screenName}
          </p>
          <p className={isLargeScreen ? "movie-text" : null}>
            座位: {bookingData.seatPosition.join(" & ")}
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default MovieInfomation;
