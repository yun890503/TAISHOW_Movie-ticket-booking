import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import "bootstrap/dist/css/bootstrap.min.css";
import "./TheaterInfomation.css";
import axios from "axios";

const TheaterInfomation = () => {
  const isLargeScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const [selectedCity, setSelectedCity] = useState("全部");
  const [theaterInfomations, setTheaterInfomations] = useState([]);

  useEffect(() => {
    const fetchTheaterInfomations = async () => {
      try {
        const response = await axios.get("http://localhost:8080/theaters");
        setTheaterInfomations(response.data);
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

    fetchTheaterInfomations();
  }, []);

  // 地區排序
  const sortedAreas = [
    "北北基宜",
    "桃竹苗",
    "中彰投",
    "雲嘉南",
    "高屏澎",
    "花東",
    "金馬",
  ];

  // 縣市排序(連江縣 === 馬祖)
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

  // 以地區分類影城
  const groupedTheaters = theaterInfomations.reduce((acc, theater) => {
    if (!acc[theater.area]) {
      acc[theater.area] = [];
    }
    acc[theater.area].push(theater);
    return acc;
  }, {});

  // 尋訪列表中，有影城的縣市
  const availableCities = cities.map((city) => ({
    name: city,
    disabled: !theaterInfomations.some((theater) =>
      theater.address.startsWith(city)
    ),
  }));

  // 利用GoogleMap的QueryParameter達成跳轉功能
  const openGoogleMap = (theaterName) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      theaterName
    )}`;
    window.open(url, "_blank");
  };

  return (
    <Container className="theat-container">
      <h2 className="title text-center my-4">影城資訊</h2>
      <Form.Group controlId="citySelect" className="mb-4">
        <Form.Label>請選擇地區：</Form.Label>
        <Form.Select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="全部">全部</option>
          {availableCities.map((city) => (
            <option key={city.name} value={city.name} disabled={city.disabled}>
              {city.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      {sortedAreas.map((area) => (
        <div key={area} className="mb-4">
          {selectedCity === "全部" && <h3>{area}</h3>}
          <Row>
            {groupedTheaters[area]
              ?.filter(
                (theater) =>
                  selectedCity === "全部" ||
                  theater.address.startsWith(selectedCity)
              )
              .map((theater, index) => (
                <Col key={index} md={6} lg={4} className="mb-4">
                  <Card
                    className="theater-card"
                    onClick={
                      isLargeScreen
                        ? () => openGoogleMap(theater.theaterName)
                        : null
                    }
                  >
                    <div className="card-image-container">
                      <Card.Img
                        variant="top"
                        src={theater.image}
                        alt={theater.theaterName}
                        className="card-image"
                      />
                    </div>
                    <Card.Body>
                      <Card.Title>{theater.theaterName}</Card.Title>
                      <Card.Text>
                        {theater.address}
                        <br />
                        {theater.tel}
                      </Card.Text>
                      {!isLargeScreen && (
                        <Button
                          variant="outline-light"
                          className="float-right"
                          onClick={() => openGoogleMap(theater.theaterName)}
                        >
                          開啟地圖
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default TheaterInfomation;
