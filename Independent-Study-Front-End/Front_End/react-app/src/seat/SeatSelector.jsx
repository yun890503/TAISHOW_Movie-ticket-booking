import React, { useState, useContext } from 'react';
import axios from 'axios';
import Seat from './Seat'; // 引入Seat组件
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { BookingContext } from "../Context/BookingContext"; // 引入 BookingContext
import { useNavigate } from 'react-router-dom';

const SeatSelector = ({ seats, toggleSeat }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();
  const selectedSeats = seats.flat().filter(seat => seat.status === 'selected');
  const { bookingData, addSeatPosition, addSeatStatusId } = useContext(BookingContext);

  const handleSubmit = async () => {
    const selectedSeatDetails = seats.flat().filter(seat => seat.status === 'selected').map(seat => ({
      row_num: seat.row_num,
      seat_num: seat.seat_num,
      status: 'taken',
      theaterName: seat.theater_name,
      screenName: seat.screen_name,
      showTimeId: bookingData.showTimeId,
      seatId: seat.seat_id
    }));
    console.log(JSON.stringify(selectedSeatDetails));

    if (selectedSeats.length === 0) {
      setAlertMessage('請先選取座位');
      setShowAlert(true);
      return; // 直接返回，不继续执行后续代码
    }

    try {
      // 发送 POST 请求到后端
      const response = await axios.post('http://localhost:8080/seat-status', selectedSeatDetails);
      
      // 获取后端返回的 reservedSeatIds
      const reservedSeatIds = response.data;
      
      // 打印返回的 reservedSeatIds
      console.log('Reserved seat IDs:', reservedSeatIds);

      // 更新 BookingProvider 中的 seatStatusId
      reservedSeatIds.forEach(id => addSeatStatusId(id));

      // 进行进一步的处理，比如显示确认信息或更新座位状态
      const selectedSeatPosition = seats.flat().filter(seat => seat.status === 'selected').map(seat => (
        `${seat.row_num}排${seat.seat_number}號`
      ));
      console.log(selectedSeatPosition);

      addSeatPosition(selectedSeatPosition);
      
      // 只有在没有异常的情况下才跳转页面
      const currentPath = window.location.pathname;
      const newPath = currentPath.replace('/seats', '/order');
      const newUrl = `${newPath}`;
      console.log(bookingData);
      navigate(newUrl);
    } catch (error) {
      if (error.response) {
        // 服务器返回了状态码，并且状态码不是2xx
        const status = error.response.status;
        const errorMessage = error.response.data;
        console.log(errorMessage);

        switch (status) {
          case 400:
            setAlertMessage(`Bad Request: ${errorMessage}`);
            break;
          case 409:
            setAlertMessage(`Conflict: ${errorMessage}`);
            break;
          default:
            setAlertMessage(`恭喜 你的座位已被其他人選取`);
        }
        setShowAlert(true);
      } else {
        // 网络错误或其他错误
        console.error('Error reserving seats:', error);
        setAlertMessage('An error occurred while reserving seats. Please try again later.');
        setShowAlert(true);
      }
    }
  };

  return (
    <>
      <Container>
        <Row className="justify-content-center mb-3">
          <Col xs="auto" className="text-center">
            <div className="color-square bg-danger"></div>
            <p className="color-square-p">已選取</p>
          </Col>
          <Col xs="auto" className="text-center">
            <div className="color-square bg-secondary"></div>
            <p className="color-square-p">不可選取</p>
          </Col>
        </Row>
        <Row className="justify-content-center mb-4">
          <Col xs={12} className="text-center">
            <div className="screen-indicator">螢幕</div>
          </Col>
        </Row>
        
        <div className="horizontal-scroll">
          <div className="seat-container">
            {seats.map((row, rowIndex) => (
              <div key={rowIndex} className="seat-row">
                {row.map((seat, index) => (
                  <div key={index}>
                    <Seat seat={seat} toggleSeat={toggleSeat} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
       
        <Row className="d-flex justify-content-center">
        <Col sm={4} md={4} lg={3}>
          <Button
            variant="outline-light"
            className="w-100"
            size="lg"
            onClick={handleSubmit}
          >
            下一步
          </Button>
        </Col>
      </Row>
        <Modal show={showAlert} onHide={() => setShowAlert(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: 'red' }}>警告</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ color: 'red' }}>{alertMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {setShowAlert(false);window.location.reload(); }}>
              關閉
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default SeatSelector;