import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Form,
  Button,
  ButtonGroup,
  Row,
  Col,
  Alert,
  Spinner,
  Modal,
} from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BookingContext } from "../Context/BookingContext";
import debounce from "lodash.debounce";
import { LuMapPin, LuMapPinOff } from "react-icons/lu";
import "./booking.css";

const Booking = () => {
  const isLargeScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const { bookingData, updateBookingData } = useContext(BookingContext);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedTheaterId, setSelectedTheaterId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedShowIndex, setSelectedShowIndex] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isShowSelected, setIsShowSelected] = useState(false);
  const navigate = useNavigate();
  const { movieId } = useParams();
  const [showDetail, setShowDetail] = useState([]);

  const [locatedCity, setLocatedCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [error, setError] = useState("");
  const [isGeoPermissionGranted, setIsGeoPermissionGranted] = useState(false);

  useEffect(() => {
    const fetchShowDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/booking/${movieId}`
        );
        setShowDetail(response.data);
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      }
    };

    fetchShowDetail();
  }, [movieId]);

  // 縣市排序
  const cities = [
    "基隆市",
    "台北市",
    "新北市",
    "桃園市",
    "新竹市",
    "新竹縣",
    "苗栗縣",
    "台中市",
    "彰化縣",
    "南投縣",
    "雲林縣",
    "嘉義市",
    "嘉義縣",
    "台南市",
    "高雄市",
    "屏東縣",
    "宜蘭縣",
    "花蓮縣",
    "台東縣",
    "澎湖縣",
    "金門縣",
    "連江縣",
  ];

  // 尋訪列表中，有影城的縣市
  const availableCities = cities.map((city) => ({
    name: city,
    disabled: !showDetail.some((theater) => theater.address.startsWith(city)),
  }));

  // 載入時，選擇第一個縣市
  useEffect(() => {
    const firstAvailableCity = availableCities.find((city) => !city.disabled);
    setSelectedCity(firstAvailableCity ? firstAvailableCity.name : "");
  }, [showDetail]);

  // 監聽 locatedCity 的變化
  useEffect(() => {
    if (locatedCity && cities.includes(locatedCity)) {
      setSelectedCity(locatedCity);
    }
  }, [locatedCity]);

  // 影城依id由小~大排序
  const theaters = showDetail
    .filter((theater) => theater.address.startsWith(selectedCity))
    .sort((a, b) => a.theaterId - b.theaterId);

  // 預設選擇地區內,id最小影城
  useEffect(() => {
    if (theaters.length > 0) {
      setSelectedTheaterId(theaters[0].theaterId);
    }
  }, [selectedCity]);

  // 當前選擇的影城
  const selectedTheater = theaters.find(
    (theater) => theater.theaterId === selectedTheaterId
  );

  // 由小到大排序日期，預設最小日期
  // 切換影城時，呈現同原本所選日期；若無則依照上方邏輯
  useEffect(() => {
    if (selectedTheater) {
      const today = new Date().toISOString().split("T")[0];
      const availableDates = Array.from(
        new Set(
          selectedTheater.showList.map((show) => show.showTime.split(" ")[0])
        )
      ).sort((a, b) => new Date(a) - new Date(b));
      if (!selectedDate || !availableDates.includes(selectedDate)) {
        const closestDate =
          availableDates.find((date) => new Date(date) >= new Date(today)) ||
          availableDates[0];
        setSelectedDate(closestDate);
      }
    }
  }, [selectedTheater]);

  // 列出所選影城有場次的日期，並由小~大排序
  const dates = selectedTheater
    ? Array.from(
        new Set(
          selectedTheater.showList.map((show) => show.showTime.split(" ")[0])
        )
      ).sort((a, b) => new Date(a) - new Date(b))
    : [];

  // 將所選日期的場次，依時間小~大排序；若時間相同，再判斷id小~大
  const shows = selectedTheater
    ? selectedTheater.showList
        .filter((show) => show.showTime.startsWith(selectedDate))
        .sort((a, b) => {
          const timeA = new Date(a.showTime).getTime();
          const timeB = new Date(b.showTime).getTime();
          return timeA - timeB || a.screenId - b.screenId;
        })
    : [];

  function handleSelectDate(date) {
    setSelectedDate(date);
    setSelectedShowIndex(null);
  }

  function handleSelectShow(index) {
    setSelectedShowIndex(index);
    setIsShowSelected(index !== null);
  }

  function handleNextStep() {
    if (!isShowSelected) {
      setShowAlert(true);
    } else {
      const selectedShow = shows[selectedShowIndex];
      updateBookingData({
        theaterId: selectedTheaterId,
        theaterName: selectedTheater.theaterName,
        address: selectedTheater.address,
        showTimeId: selectedShow.showTimeId,
        showTime: selectedShow.showTime,
        screenId: selectedShow.screenId,
        screenName: selectedShow.screenName,
        screenClass: selectedShow.screenClass,
        title: "", // 該頁未Fetch電影資料
        poster: "",
        seatStatusId: [], // 初始化為未選擇座位
        seatPosition: [],
        ticketTypeId: [],
      });
      console.log(updateBookingData);
      const newUrl = `${window.location.pathname}/seats`;
      navigate(newUrl);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  function formatTime(timeString) {
    const date = new Date(timeString);
    return date.toTimeString().split(" ")[0].substring(0, 5);
  }

  const handleAllowGeolocation = () => {
    setShowModal(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          debouncedGetCityName(latitude, longitude);
          setIsGeoPermissionGranted(true);
        },
        (error) => {
          console.error("Error getting geolocation: ", error);
          showErrorAlert("無法取得定位資訊，請檢查您的設定或稍後再試。");
        }
      );
    } else {
      showErrorAlert("您的瀏覽器不支援地理定位。");
    }
  };

  const getCityName = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      let city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        "無法取得定位資訊";

      city = city.replace("臺", "台");
      setLocatedCity(city);
    } catch (error) {
      console.error("Error fetching city name: ", error);
      showErrorAlert("無法取得定位資訊，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  const debouncedGetCityName = debounce(getCityName, 500);

  const handleRetry = () => {
    setLocatedCity("");
    setError(null);
    setShowModal(true);
    setIsGeoPermissionGranted(false);
  };

  const showErrorAlert = (errorMsg) => {
    setError(errorMsg);
  };

  const closeErrorAlert = () => {
    setError("");
  };

  return (
    <Container className="booking-container">
      {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" role="status" className="custom-spinner">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      <Form.Group controlId="city" className="mb-3">
        <Form.Label>請選擇地區：</Form.Label>
        <div className="icon-inside-select">
          <Form.Select
            value={selectedCity}
            onChange={(e) => {
              setSelectedCity(e.target.value);
              setSelectedTheaterId(null);
              setSelectedShowIndex(null);
              setIsShowSelected(false);
            }}
            className="hide-select-arrow"
          >
            {availableCities.map((city) => (
              <option
                key={city.name}
                value={city.name}
                disabled={city.disabled}
              >
                {city.name}
              </option>
            ))}
          </Form.Select>
          {isGeoPermissionGranted ? (
            <LuMapPin
              className="icon geo-permission-granted"
              size={26}
              onClick={handleRetry}
            />
          ) : (
            <LuMapPinOff
              className="icon not-geo-permission-granted"
              size={26}
              onClick={handleRetry}
            />
          )}
        </div>
      </Form.Group>

      {error && (
        <Alert
          className="mb-3"
          variant="danger"
          onClose={closeErrorAlert}
          dismissible
        >
          {error}
        </Alert>
      )}

      <Form.Group controlId="theater" className="mb-3">
        <Form.Label>請選擇影城：</Form.Label>
        <Form.Select
          value={selectedTheaterId || ""}
          onChange={(e) => {
            setSelectedTheaterId(Number(e.target.value));
            setSelectedShowIndex(null);
            setIsShowSelected(false);
          }}
          className="hide-select-arrow"
        >
          {theaters.map((theater) => (
            <option value={theater.theaterId} key={theater.theaterId}>
              {theater.theaterName}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <div className={isLargeScreen ? "" : "scroll-container mb-3"}>
        <ButtonGroup
          size="lg"
          className={isLargeScreen ? "d-flex flex-wrap mb-3" : ""}
        >
          {dates.map((date, index) => (
            <Button
              key={index}
              variant={selectedDate === date ? "danger" : "dark"}
              onClick={() => handleSelectDate(date)}
            >
              {date === new Date().toISOString().split("T")[0]
                ? "Today"
                : formatDate(date)}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <Row className="justify-content-start">
        {shows.map((show, index) => (
          <Col xs={4} sm={4} md={4} lg={3} key={index} className="mb-3">
            <Button
              variant={selectedShowIndex === index ? "danger" : "dark"}
              className="w-100"
              onClick={() => handleSelectShow(index)}
            >
              <div className="d-flex flex-column align-items-center">
                <span>{formatTime(show.showTime)}</span>
                <span>
                  {show.screenName} ( {show.screenClass} )
                </span>
              </div>
            </Button>
          </Col>
        ))}
      </Row>
      {showAlert && <Alert variant="danger">請先選擇場次</Alert>}
      <Row className="d-flex justify-content-center">
        <Col sm={4} md={4} lg={3}>
          <Button
            variant="outline-light"
            className="w-100"
            size="lg"
            onClick={handleNextStep}
          >
            下一步
          </Button>
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered={!isLargeScreen}
      >
        <Modal.Header closeButton>
          <Modal.Title>發現附近的影城</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className={
            isLargeScreen ? "custom-modal-content-lg" : "custom-modal-content-m"
          }
        >
          開啟定位，我們將幫助您找到您所在城市的影城，提供更精確的服務。是否允許使用定位功能？
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            拒絕
          </Button>
          <Button variant="primary" onClick={handleAllowGeolocation}>
            允許
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Booking;
