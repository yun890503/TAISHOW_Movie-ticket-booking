import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Container, Row, Col, Button, Card, Carousel } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import Cookies from "js-cookie";
import ReactPlayer from "react-player";
import "../pages/moviestyle.css";

const Detail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movieDetails || {};
  const isLargeScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const [isHidden, setIsHidden] = useState(false);
  const averageScore =
    movie.reviews?.reduce((acc, review) => acc + review.score, 0) /
    (movie.reviews?.length || 1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsHidden(scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!movie.title) return <div>Loading...</div>;

  const handleViewMore = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        `http://localhost:8080/reviews/${movie.id}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      const reviewDetailDto = response.data;
      console.log(reviewDetailDto);
      navigate(`/reviews/${movie.id}`, {
        state: { movieId: movie.id, reviewDetailDto },
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  return (
    <Container className="bg-dark text-white mt-4 pt-5">
      <div
        className="position-fixed"
        style={{
          left: "90%",
          top: "30%",
          zIndex: 1000,
          display: isHidden ? "block" : "none",
          writingMode: "vertical-lr",
          maxWidth: "calc(100% - 200px)",
          overflowX: "hidden",
        }}
      >
        <Link to={`/booking/${movie.id}`}>
          <Button
            className="MDmoviestyle-text"
            style={{ padding: "8px 5px", fontWeight: "600" }}
          >
            立即訂票
          </Button>
        </Link>
      </div>
      <Row>
        <Col>
          <div className="mdmoviestyle-img-wrapper img-fluid position-relative">
            <img
              className="mdmoviestyle-img img-fluid"
              src={movie.poster}
              alt={movie.title}
            />
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${movie.trailer}`}
              playing={true}
              controls={true}
              width="100%"
              height="100%"
              className="position-absolute top-50 start-50 translate-middle"
            />
            <div
              className={
                isLargeScreen ? "position-absolute" : "ms-dispaly-none"
              }
              style={{
                bottom: "-45px",
                right: "0",
                padding: "3px",
                display: isHidden ? "none" : "block",
              }}
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className={isLargeScreen ? "img-fluid" : "ms-dispaly-none"}
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "250px",
                  boxShadow:
                    "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                  backgroundColor: "#fff",
                  marginBottom: "10px",
                }}
              />
              <Link to={`/booking/${movie.id}`}>
                <Button
                  className={isLargeScreen ? " " : "ms-dispaly-none"}
                  style={{ width: "100%", fontWeight: "600" }}
                >
                  立即訂票
                </Button>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="mt-2">
        <h1>{movie.title}</h1>
        <h3>{movie.title_english}</h3>
        <Col className="mt-2">
          <hr className="mshr-style" />
          <span className="msborder-style MDmoviestyle-text-small">
            {movie.rating}
          </span>
          <span className="msborder-style">
            <FontAwesomeIcon
              icon={faStar}
              style={{ color: "#FFD43B", fontSize: "18px" }}
            />
            <span className="MDmoviestyle-text-small">
              {averageScore.toFixed(1)}
            </span>{" "}
          </span>
          <span className="msborder-style MDmoviestyle-text-small">
            {movie.genre}
          </span>
          <span className="msborder-style MDmoviestyle-text-small">
            {movie.runtime}分鐘
          </span>
          <div className="mt-3 MDmoviestyle-text-small">{movie.synopsis}</div>
          <div className="mt-3 MDmoviestyle-text-small">
            導演: {movie.director}
          </div>
          <div className="MDmoviestyle-text-small">
            主演: {movie.actors?.map((actor) => actor.name).join(" / ")}
          </div>
          <div className="MDmoviestyle-text-small">語言: {movie.language}</div>
        </Col>
      </Row>
      <Row className="mt-5 justify-content-between">
        <h4>精彩劇照</h4>
        {movie.stills?.map((still, index) => (
          <img
            key={index}
            className="ms-stills col-xxl-4 col-xl-12 col-lg-12 d-flex justify-content-center mb-3"
            src={`${still.stills}.jpg`}
            alt={`still-${index}`}
          ></img>
        ))}
      </Row>
      <Row className="mt-5 justify-content-between">
        <h4>主要演員</h4>
        <Carousel indicators={false} controls={false}>
          {movie.actors
            ?.reduce((result, actor, index) => {
              const chunkIndex = Math.floor(index / 3);

              if (!result[chunkIndex]) {
                result[chunkIndex] = [];
              }

              result[chunkIndex].push(
                <Col
                  key={index}
                  className="col-4 d-flex flex-column align-items-center mb-3"
                >
                  <img
                    src={`${actor.actors}.jpg`}
                    alt={`actor-${index}`}
                    style={{
                      width: "550px",
                      height: "350px",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    className="mt-2 text-center"
                    style={{ fontSize: "18px" }}
                  >
                    {actor.name}
                  </div>{" "}
                </Col>
              );

              return result;
            }, [])
            .map((chunk, chunkIndex) => (
              <Carousel.Item key={chunkIndex}>
                <Row>{chunk}</Row>
              </Carousel.Item>
            ))}
        </Carousel>
      </Row>

      <Row className="d-flex justify-content-start mt-5">
        <Col>
          <span className="h4 me-3">精彩評論</span>
          <span className="MDmoviestyle-text-small">
            <Button onClick={handleViewMore} className="ms-more-button">
              更多&gt;
            </Button>
          </span>
          <hr className="mshr-style" />
          {movie.reviews?.map((review, index) => (
            <Card
              key={index}
              className="my-3 MDmoviestyle-body MDmoviestyle-text bg-dark position-relative"
            >
              <Card.Body>
                <Row className="align-items-start">
                  <Col xs="auto">
                    <img
                      src={
                        review.photo
                          ? review.photo
                          : "/src/assets/Default_pfp.svg.webp"
                      }
                      alt={review.nickName || "匿名用戶"}
                      className="rounded-circle"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  </Col>
                  <Col>
                    <div className="d-flex flex-column">
                      <Card.Title className="mb-0 small">
                        {`${review.nickName || "匿名用戶"}`}
                        <span
                          className="text-muted ms-2"
                          style={{ fontSize: "0.8em" }}
                        >
                          {[...Array(5)].map((_, i) => (
                            <FontAwesomeIcon
                              key={i}
                              icon={faStar}
                              style={{
                                color: i < review.score ? "yellow" : "gray",
                              }}
                            />
                          ))}
                        </span>
                      </Card.Title>
                      <div className="small">{review.comment}</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <div
                className="position-absolute"
                style={{
                  bottom: "10px",
                  right: "10px",
                  fontSize: "0.8em",
                  color: "white",
                }}
              >
                {new Date(review.reviewDate).toLocaleDateString("zh-TW", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}{" "}
                {new Date(review.reviewDate).toLocaleTimeString("zh-TW", {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default Detail;
