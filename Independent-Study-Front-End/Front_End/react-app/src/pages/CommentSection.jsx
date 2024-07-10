import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faHeart,
  faHeartBroken,
  faFlag,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  InputGroup,
  FormControl,
  Card,
  Modal,
  ProgressBar,
} from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import "../pages/moviestyle.css";

const Rating = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editReviewContent, setEditReviewContent] = useState("");
  const [editReviewRating, setEditReviewRating] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReviewId, setDeleteReviewId] = useState(null);
  const [reviewDetailDto, setreviewDetailDto] = useState(null);
  const [messages, setMessages] = useState([]);
  const [ratingStats, setRatingStats] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchMovieReviewDetail = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(
          `http://localhost:8080/reviews/${movieId}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );
        const data = response.data;
        setreviewDetailDto(data);
        setMessages(data.comments);
        setRatingStats({
          1: data.oneStarRate || 0,
          2: data.twoStarRate || 0,
          3: data.threeStarRate || 0,
          4: data.fourStarRate || 0,
          5: data.fiveStarRate || 0,
        });
        const avgRating = data.scoreAvg === 0 ? 0 : data.scoreAvg.toFixed(1);
        setAverageRating(avgRating);
      } catch (error) {
        console.error("Error fetching user review:", error);
      }
    };
    fetchMovieReviewDetail();
  }, [movieId]);

  const handleStarClick = (star) => setRating(star);

  const handleMessageSubmit = async () => {
    if (rating < 1) {
      alert("評分星數最低為一顆星");
      return;
    }
    try {
      const token = Cookies.get("token");
      if (!token) {
        setShowLoginModal(true);
        return;
      }

      await axios.post(
        `http://localhost:8080/reviews/${movieId}`,
        { score: rating, comment: review },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleEditClick = (msg) => {
    setEditReviewId(msg.reviewId);
    setEditReviewContent(msg.comment);
    setEditReviewRating(msg.score);
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const token = Cookies.get("token");
      await axios.put(
        `http://localhost:8080/reviews/${movieId}`,
        { score: editReviewRating, comment: editReviewContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowEditModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleDeleteClick = (msg) => {
    setDeleteReviewId(msg.reviewId);
    setShowDeleteModal(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      const token = Cookies.get("token");
      await axios.delete(`http://localhost:8080/reviews/${movieId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setShowDeleteModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleInteractiveSubmit = async (reviewId, action) => {
    try {
      const token = Cookies.get("token");
      await axios.post(
        `http://localhost:8080/reviews/${reviewId}/interaction`,
        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error submitting interactive:", error);
    }
  };

  const handleLike = (reviewId) => {
    handleInteractiveSubmit(reviewId, "likeit");
  };

  const handleDislike = (reviewId) => {
    handleInteractiveSubmit(reviewId, "dislike");
  };

  const handleReport = (reviewId) => {
    handleInteractiveSubmit(reviewId, "report");
  };

  const calculatePercentages = () => {
    const totalRatings = Object.values(ratingStats).reduce(
      (sum, count) => sum + count,
      0
    );
    if (totalRatings === 0) return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    const percentages = {};
    for (let i = 1; i <= 5; i++) {
      percentages[i] = Math.round((ratingStats[i] / totalRatings) * 100);
    }
    return percentages;
  };

  const renderStars = (currentRating, onClick) => {
    const fullStars = Math.floor(currentRating);
    const halfStar = currentRating % 1 >= 0.5;

    return (
      <div>
        {[...Array(fullStars)].map((_, i) => (
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            style={{ color: "#FFD700", cursor: "pointer" }}
            onClick={() => onClick(i + 1)}
          />
        ))}
        {halfStar && (
          <FontAwesomeIcon
            icon={faStarHalfAlt}
            style={{ color: "#FFD700", cursor: "pointer" }}
            onClick={() => onClick(fullStars + 0.5)}
          />
        )}
        {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
          <FontAwesomeIcon
            key={fullStars + i + 1}
            icon={faStar}
            style={{ color: "#d3d3d3", cursor: "pointer" }}
            onClick={() => onClick(fullStars + i + 1)}
          />
        ))}
      </div>
    );
  };

  const percentages = calculatePercentages();

  return (
    <Container className="bg-dark text-white mt-4 pt-5 ps-0 pe-0">
      <Row className="justify-content-center">
        <Col className="mx-5">
          <Row className="mt-4">
            <Col lg={3}>
              <Image
                src={reviewDetailDto?.poster}
                alt={reviewDetailDto?.title}
              />
            </Col>
            <Col lg={9}>
              <h1 className="ms-large-title">{reviewDetailDto?.title}</h1>
              <Row>
                <Col lg={2}>
                  <div className="d-flex flex-column align-items-center">
                    <h2 className="mt-3 ms-md-title">{averageRating}</h2>
                    <div>{renderStars(averageRating, handleStarClick)}</div>
                    <p>{reviewDetailDto?.totalCommentsNum} 則評論</p>
                  </div>
                </Col>

                <Col lg={10}>
                  <div className="mt-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div
                        key={star}
                        className="d-flex align-items-center mb-2"
                      >
                        <span className="me-2 small">{star}</span>
                        <ProgressBar
                          now={percentages[star]}
                          variant={"success"}
                          style={{ flex: 1, height: "10px" }}
                        />
                      </div>
                    ))}
                  </div>
                </Col>

                <Col lg={12}>
                  <hr className="mshr-style mt-4 mb-2" />
                  <Row>
                    <div className="mt-1">
                      {reviewDetailDto?.isPlaying && (
                        <span className="msborder-style MDmoviestyle-text-small">
                          現正熱映
                        </span>
                      )}
                      {reviewDetailDto?.scoreAvg >= 4 &&
                        reviewDetailDto?.scoreAvg <= 5 && (
                          <span className="msborder-style MDmoviestyle-text-small">
                            壓倒性好評
                          </span>
                        )}
                      {reviewDetailDto?.scoreAvg >= 3 &&
                        reviewDetailDto?.scoreAvg < 4 && (
                          <span className="msborder-style MDmoviestyle-text-small">
                            大多好評
                          </span>
                        )}
                      {reviewDetailDto?.scoreAvg >= 2 &&
                        reviewDetailDto?.scoreAvg < 3 && (
                          <span className="msborder-style MDmoviestyle-text-small">
                            大多負評
                          </span>
                        )}
                      {reviewDetailDto?.scoreAvg >= 1 &&
                        reviewDetailDto?.scoreAvg < 2 && (
                          <span className="msborder-style MDmoviestyle-text-small">
                            壓倒性負評
                          </span>
                        )}
                    </div>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>

          <h2 className="mt-4">我的評價</h2>
          {reviewDetailDto?.ownComment ? (
            <Card className="my-3 MDmoviestyle-body MDmoviestyle-text bg-dark position-relative">
              <Card.Body>
                <Row className="align-items-start">
                  <Col xs="auto">
                    <img
                      src={
                        reviewDetailDto?.ownComment.photo
                          ? reviewDetailDto?.ownComment.photo
                          : "/src/assets/Default_pfp.svg.webp"
                      }
                      alt={reviewDetailDto?.ownComment.nickName || "匿名用戶"}
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
                        {`${
                          reviewDetailDto?.ownComment.nickName || "匿名用戶"
                        }`}
                        <span
                          className="text-muted ms-2"
                          style={{ fontSize: "0.8em" }}
                        >
                          {[...Array(5)].map((_, i) => (
                            <FontAwesomeIcon
                              key={i}
                              icon={faStar}
                              style={{
                                color:
                                  i < reviewDetailDto?.ownComment.score
                                    ? "yellow"
                                    : "gray",
                              }}
                            />
                          ))}
                        </span>
                      </Card.Title>
                      <div className="small">
                        {reviewDetailDto?.ownComment.comment}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <div
                className="position-absolute"
                style={{ top: "10px", right: "10px" }}
              >
                <span className="me-3">
                  <FontAwesomeIcon
                    icon={faHeart}
                    style={{
                      color: reviewDetailDto?.ownComment.isLikeIt
                        ? "red"
                        : "gray",
                    }}
                    onClick={() =>
                      handleLike(reviewDetailDto?.ownComment.reviewId)
                    }
                  />{" "}
                  {reviewDetailDto?.ownComment.likeIt}
                </span>
                <span className="me-3">
                  <FontAwesomeIcon
                    icon={faHeartBroken}
                    style={{
                      color: reviewDetailDto?.ownComment.isDislike
                        ? "red"
                        : "gray",
                    }}
                    onClick={() =>
                      handleDislike(reviewDetailDto?.ownComment.reviewId)
                    }
                  />{" "}
                  {reviewDetailDto?.ownComment.dislike}
                </span>
                <span className="me-3">
                  <FontAwesomeIcon
                    icon={faEdit}
                    style={{ color: "gray", cursor: "pointer" }}
                    onClick={() => handleEditClick(reviewDetailDto?.ownComment)}
                  />
                </span>
                <span>
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    style={{ color: "gray", cursor: "pointer" }}
                    onClick={() =>
                      handleDeleteClick(reviewDetailDto?.ownComment)
                    }
                  />
                </span>
              </div>
              <div
                className="position-absolute"
                style={{
                  bottom: "10px",
                  right: "10px",
                  fontSize: "0.8em",
                  color: "white",
                }}
              >
                {new Date(
                  reviewDetailDto?.ownComment.reviewDate
                ).toLocaleDateString("zh-TW", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}{" "}
                {new Date(
                  reviewDetailDto?.ownComment.reviewDate
                ).toLocaleTimeString("zh-TW", {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
            </Card>
          ) : (
            <>
              <div className="d-flex align-items-center">
                <div>{renderStars(rating, handleStarClick)}</div>
              </div>
              <InputGroup className="mt-2">
                <FormControl
                  as="textarea"
                  rows={3}
                  placeholder="發表您的評論..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
              </InputGroup>
              <div className="d-flex align-items-center mt-2">
                <Button
                  variant="primary"
                  className="ms-auto"
                  onClick={handleMessageSubmit}
                >
                  發表評論
                </Button>
              </div>
            </>
          )}

          <hr className="bg-white mt-4" />
          <h2 className="mt-4">評論區</h2>
          {messages.map((msg, index) => (
            <Card
              key={index}
              className="my-3 MDmoviestyle-body MDmoviestyle-text bg-dark position-relative"
            >
              <Card.Body>
                <Row className="align-items-start">
                  <Col xs="auto">
                    <img
                      src={
                        msg.photo
                          ? msg.photo
                          : "/src/assets/Default_pfp.svg.webp"
                      }
                      alt={msg.nickName || "匿名用戶"}
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
                        {`${msg.nickName || "匿名用戶"}`}
                        <span
                          className="text-muted ms-2"
                          style={{ fontSize: "0.8em" }}
                        >
                          {[...Array(5)].map((_, i) => (
                            <FontAwesomeIcon
                              key={i}
                              icon={faStar}
                              style={{
                                color: i < msg.score ? "yellow" : "gray",
                              }}
                            />
                          ))}
                        </span>
                      </Card.Title>
                      <div className="small">{msg.comment}</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <div
                className="position-absolute"
                style={{ top: "10px", right: "10px" }}
              >
                <span className="me-3">
                  <FontAwesomeIcon
                    icon={faHeart}
                    style={{
                      color: msg.isLikeIt ? "red" : "gray",
                    }}
                    onClick={() => handleLike(msg.reviewId)}
                  />{" "}
                  {msg.likeIt}
                </span>
                <span className="me-3">
                  <FontAwesomeIcon
                    icon={faHeartBroken}
                    style={{
                      color: msg.isDislike ? "red" : "gray",
                    }}
                    onClick={() => handleDislike(msg.reviewId)}
                  />{" "}
                  {msg.dislike}
                </span>
                <span>
                  <FontAwesomeIcon
                    icon={faFlag}
                    style={{
                      color: msg.isReport ? "gray" : "red",
                    }}
                    onClick={() => handleReport(msg.reviewId)}
                    disabled={msg.isReport}
                  />
                </span>
              </div>
              <div
                className="position-absolute"
                style={{
                  bottom: "10px",
                  right: "10px",
                  fontSize: "0.8em",
                  color: "white",
                }}
              >
                {new Date(msg.reviewDate).toLocaleDateString("zh-TW", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}{" "}
                {new Date(msg.reviewDate).toLocaleTimeString("zh-TW", {
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

      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>請先登入</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="primary" onClick={() => navigate("/login")}>
            登入
          </Button>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>編輯評論</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center">
            <div>{renderStars(editReviewRating, setEditReviewRating)}</div>
          </div>
          <InputGroup className="mt-2">
            <FormControl
              placeholder="編輯評論"
              value={editReviewContent}
              onChange={(e) => setEditReviewContent(e.target.value)}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            取消
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            更新評論
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>刪除評論</Modal.Title>
        </Modal.Header>
        <Modal.Body>你確定要刪除這條評論嗎？</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            取消
          </Button>
          <Button variant="danger" onClick={handleDeleteSubmit}>
            刪除
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Rating;
