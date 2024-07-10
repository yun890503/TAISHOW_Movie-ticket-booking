import React, { useContext, useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Spinner,
  Alert,
  Modal,
  Toast,
} from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BookingContext } from "../Context/BookingContext";
import "./order.css";
import Cookies from "js-cookie";

const SelectTicket = () => {
  const { movieId } = useParams();
  const {
    bookingData,
    updateBookingData,
    addTicketTypeId,
    removeTicketTypeId,
  } = useContext(BookingContext);
  const isLargeScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const navigate = useNavigate();

  const [ticketTypes, setTicketTypes] = useState([]);
  const [ticketCounts, setTicketCounts] = useState({});
  const [ticketToRemove, setTicketToRemove] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchTicketTypeDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/booking/${movieId}/order`
        );
        const data = response.data;
        setTicketTypes(data);

        const initialCounts = data.reduce((counts, ticket) => {
          counts[ticket.ticketType] = 0;
          return counts;
        }, {});
        setTicketCounts(initialCounts);
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

    fetchTicketTypeDetail();
  }, [movieId]);

  useEffect(() => {
    if (ticketToRemove !== null) {
      removeTicketTypeId(ticketToRemove);
      setTicketToRemove(null);
    }
  }, [ticketToRemove, removeTicketTypeId]);

  useEffect(() => {
    const isBookingDataIncomplete = (data) => {
      const requiredFields = [
        "theaterId",
        "theaterName",
        "address",
        "showTimeId",
        "showTime",
        "screenId",
        "screenName",
        "screenClass",
        "title",
        "poster",
        "seatStatusId",
        "seatPosition",
      ];

      return requiredFields.some(
        (field) =>
          !data[field] ||
          (Array.isArray(data[field]) && data[field].length === 0)
      );
    };

    if (isBookingDataIncomplete(bookingData)) {
      navigate(`/booking/${movieId}`);
    }
  }, [bookingData, movieId, navigate]);

  const subTotalPrice = ticketTypes.reduce((total, ticket) => {
    return total + ticketCounts[ticket.ticketType] * ticket.unitPrice;
  }, 0);

  const bookingFee = ticketTypes.reduce((total, ticket) => {
    return (
      total +
      Math.floor(ticketCounts[ticket.ticketType] * ticket.unitPrice * 0.1)
    );
  }, 0);

  const totalCount = ticketTypes.reduce((total, ticket) => {
    return total + ticketCounts[ticket.ticketType];
  }, 0);

  const totalPrice = subTotalPrice + bookingFee;

  const handleAddTicket = (ticket) => {
    if (totalCount < bookingData.seatStatusId.length) {
      setTicketCounts((prevCounts) => ({
        ...prevCounts,
        [ticket.ticketType]: prevCounts[ticket.ticketType] + 1,
      }));
      addTicketTypeId(ticket.id);
    }
  };

  const handleMinusTicket = (ticket) => {
    const newCount = Math.max(ticketCounts[ticket.ticketType] - 1, 0);
    if (newCount < ticketCounts[ticket.ticketType]) {
      removeTicketTypeId(ticket.id);
    }
    setTicketCounts((prevCounts) => ({
      ...prevCounts,
      [ticket.ticketType]: newCount,
    }));
  };

  const isLogin = async () => {
    try {
      const token = Cookies.get("token");
      return !!token;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleSendOrder = async () => {
    // 防止重複提交
    if (toastMessage !== "") {
      setShowModal(false);
      return;
    }

    setError(null);
    setShowModal(false);
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `http://localhost:8080/booking/${movieId}/order`,
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setToastMessage("正在為您導轉至付款頁面...");
        setShowToast(true);
        setTimeout(() => {
          const newWindow = window.open();
          newWindow.document.open();
          newWindow.document.write(response.data);
          newWindow.document.close();
          navigate("/orderlist");
        }, 3000);
      } else {
        setToastMessage("正在為您導轉至歷史訂單...");
        setShowToast(true);
        setTimeout(() => {
          navigate("/orderlist");
        }, 3000);
      }

      console.log(response.data); // 在這裡處理後端的回應

      // 初始化 bookingData
      setTimeout(() => {
        updateBookingData({
          theaterId: null,
          theaterName: "",
          address: "",
          showTimeId: null,
          showTime: "",
          screenId: null,
          screenName: "",
          screenClass: "",
          title: "",
          poster: "",
          seatStatusId: [],
          seatPosition: [],
          ticketTypeId: [],
        });
      }, 3000);
    } catch (error) {
      if (error.response) {
        setError(error.response.data);
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        setError("訂單提交失敗，請稍後再試。");
        console.log(error.request);
      } else {
        setError("訂單提交失敗，請稍後再試。");
        console.log("Error", error.message);
      }
      console.log(error.config);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderConfirmation = async () => {
    const loggedIn = await isLogin();
    if (loggedIn) {
      setShowModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleRedirect = () => {
    navigate("/login");
  };

  return (
    <Container className="my-4">
      {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" role="status" className="custom-spinner">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      <h2 className="text-center">選擇電影票</h2>
      <div
        className={
          isLargeScreen ? "ticket-counter-m mb-3" : "ticket-counter-sm mb-3"
        }
      >
        已選擇 {totalCount} / {bookingData.seatStatusId.length} 張票
      </div>
      <div className="wrap mb-3">
        <table>
          <thead>
            <tr>
              <th>票種</th>
              <th>單價</th>
              <th>數量</th>
              <th>小計</th>
            </tr>
          </thead>
          <tbody>
            {ticketTypes.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.ticketType}</td>
                <td>
                  {ticket.ticketType === "紅利點數"
                    ? "250點"
                    : `$${ticket.unitPrice}`}
                </td>
                <td>
                  <button
                    className={
                      ticketCounts[ticket.ticketType] === 0
                        ? "count-button-disabled"
                        : "count-button"
                    }
                    onClick={() => handleMinusTicket(ticket)}
                  >
                    -
                  </button>
                  <span className={isLargeScreen ? "mx-2" : null}>
                    {ticketCounts[ticket.ticketType]}
                  </span>
                  <button
                    className={
                      totalCount === bookingData.seatStatusId.length
                        ? "count-button-disabled"
                        : "count-button"
                    }
                    onClick={() => handleAddTicket(ticket)}
                  >
                    +
                  </button>
                </td>
                <td>${ticketCounts[ticket.ticketType] * ticket.unitPrice}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-s">
                小計
              </td>
              <td>${subTotalPrice}</td>
            </tr>
            <tr>
              <td colSpan="3" className="text-s">
                預訂費 (10%)
              </td>
              <td>${bookingFee}</td>
            </tr>
            <tr>
              <td colSpan="3" className="text-s">
                總計
              </td>
              <td>${totalPrice}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="d-flex justify-content-center my-4">
        <Col sm={4} md={4} lg={3}>
          <Button
            variant="outline-light"
            className="w-100"
            size="lg"
            onClick={handleOrderConfirmation}
          >
            確認訂單
          </Button>
        </Col>
      </Row>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        centered={!isLargeScreen}
        scrollable="true"
      >
        <Modal.Header closeButton>
          <Modal.Title>購票須知</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className={
            isLargeScreen ? "custom-modal-content-lg" : "custom-modal-content-m"
          }
        >
          <li>
            請確認訂購之影城、片名、級別、日期、場次、時間、座位資訊無誤。
          </li>
          <li>
            電影票於影城現場也同步出售，只需於訂購的電影開場前完成取票即可（為免假日人潮建議提早30分鐘）。
          </li>
          <li>
            為避免影響其他觀眾之權益，電影開演30分鐘後，即無法入場。該電影票即為隔場票券並作廢，恕無法受理退票或更換。
          </li>
          <li>
            交易成功後，如逾期未取票者，影城現場並不會自動取消座位或退款，仍需支付該筆費用。
          </li>
          <li>
            電影分級依文化局規定電影分級制度分為五級，請於訂票前，了解分級規範。如因不符相關規定而無法入場，現場將協助引導退換票事宜。
          </li>
          <li>
            為維護顧客權益，惡意佔位或影響他人正常訂位使用者，泰秀保有調整或取消訂位之權利。
          </li>
          <li>
            網路、手機預購票券，請持購票代碼及身份證明證件（或原購票信用卡）至專屬櫃台票口兌換實體票券入場。
          </li>
          <li>
            請妥善保管電影票券，如遺失、破損、燒毀及無法辨識等情形，恕不重新開票。任何憑證皆無法取代票券本身，恕無法持任何憑證要求入場或補開票券。
          </li>
          <li>已取票者，該筆訂單恕無法辦理退票。</li>
          <li>
            未取票如欲退票，請於所訂購場次之開演時間前30分鐘聯絡客服取消訂單。避免與系統時間有落差，請盡量提早辦理。請務必確認訂單狀態為【已退款】，該筆訂單才算退票成功。
          </li>
          <li>
            已售出之票券無法更改場次、時間，如欲更改場次或時間必須先行退票再重新訂票。
          </li>
          <li>
            請務必確認訂票資訊是否正確，如因個人事項超過放映時間，恕不辦理退票。
          </li>
          <li>
            使用本系統購票成功時，每一張票券須收取預定費（10%），如欲退票者，預定費恕不退還。
          </li>
          <li>如欲退票時，將整筆訂單進行退票，恕不提供單一票券退款。</li>
          <li>
            申請退票時，請確保紅利點數足夠且未被使用，否則將收取相應的金額作為紅利點數的補償。
          </li>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            取消
          </Button>
          <Button variant="primary" onClick={handleSendOrder}>
            確認
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        backdrop="static"
        centered={!isLargeScreen}
      >
        <Modal.Header closeButton>
          <Modal.Title>尚未登入</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className={
            isLargeScreen ? "custom-modal-content-lg" : "custom-modal-content-m"
          }
        >
          <p>
            您尚未登入TaiShow會員，請先登入以繼續進行操作。
            <br />
            點擊登入將為您導引至登入頁面。
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            取消
          </Button>
          <Button variant="primary" onClick={handleRedirect}>
            登入
          </Button>
        </Modal.Footer>
      </Modal>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        bg="dark"
        className="send-order-toast"
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </Container>
  );
};

export default SelectTicket;
