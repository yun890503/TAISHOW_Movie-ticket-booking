import React, { useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import "../pages/Loginpage.css";
import { useMediaQuery } from "react-responsive";

const REGISTER_URL = "http://localhost:8080/user/register";
const SEND_VERIFICATION_URL = "http://localhost:8080/user/sendVerification";
const CHECK_ACCOUNT_EMAIL_URL = "http://localhost:8080/user/checkAccountEmail";

const Info = () => {
  const isLargeScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const [account, setAccount] = useState("");
  const [passwd, setPasswd] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountError, setAccountError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [userNameError, setUserNameError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUserNameChange = (e) => {
    const value = e.target.value;
    setUserName(value);
    validateUserName(value);
  };

  const handleAccountChange = (e) => {
    setAccount(e.target.value);
    validateAccount(e.target.value);
  };

  const handlePasswdChange = (e) => {
    setPasswd(e.target.value);
    validatePassword(e.target.value);
  };

  const handleConfirmPasswdChange = (e) => {
    setConfirmPassword(e.target.value);
    validateConfirmPassword(passwd, e.target.value);
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      setEmailError("請輸入有效的電子郵件地址");
    } else {
      setEmailError("");
    }
  };

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const validateUserName = (userName) => {
    if (userName.trim() === "") {
      setUserNameError("姓名不能為空");
    } else {
      setUserNameError("");
    }
  };

  const validateAccount = (account) => {
    if (!/^[a-zA-Z0-9]{6,20}$/.test(account)) {
      setAccountError("帳號必須為6到20個字符，且只能包含字母和數字");
    } else {
      setAccountError("");
    }
  };

  const validatePassword = (passwd) => {
    if (
      passwd.length < 8 ||
      !/[A-Z]/.test(passwd) ||
      !/[a-z]/.test(passwd) ||
      !/[0-9]/.test(passwd) ||
      !/[!@#$%^&*]/.test(passwd)
    ) {
      setPasswordError(
        "密碼必須包含至少8個字符，包括大小寫字母、數字和特殊字符"
      );
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = (passwd, confirmPassword) => {
    if (passwd !== confirmPassword) {
      setPasswordError("密碼和確認密碼不匹配");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userName.trim() === "") {
      setUserNameError("姓名不能為空");
      return;
    }

    if (passwd !== confirmPassword) {
      setPasswordError("密碼和確認密碼不匹配");
      return;
    }

    const requestData = { email, account };

    axios
      .post(CHECK_ACCOUNT_EMAIL_URL, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        axios
          .post(
            SEND_VERIFICATION_URL,
            { email },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then(function (response) {
            setIsVerificationSent(true);
            setShowModal(true);
            setErrorMessage("");
            console.log(response);
          })
          .catch(function (error) {
            if (error.response && error.response.data) {
              setErrorMessage(JSON.stringify(error.response.data));
            }
            console.log(error);
          });
      })
      .catch(function (error) {
        if (error.response && error.response.data) {
          if (typeof error.response.data === "string") {
            setErrorMessage(error.response.data);
          } else if (error.response.data.error) {
            setErrorMessage(error.response.data.error);
          } else {
            setErrorMessage(JSON.stringify(error.response.data));
          }
        }
        console.log(error);
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const requestData = {
      userName,
      account,
      passwd,
      confirmPassword,
      email,
      verificationCode,
    };

    setIsLoading(true);

    axios
      .post(REGISTER_URL, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        setIsLoading(false);
        setShowModal(false); // 隱藏驗證碼模態對話框
        setShowSuccessModal(true);
        console.log(response);

        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      })
      .catch(function (error) {
        setIsLoading(false);
        if (error.response && error.response.data) {
          if (typeof error.response.data === "string") {
            setErrorMessage(error.response.data);
          } else if (error.response.data.error) {
            setErrorMessage(error.response.data.error);
          } else {
            setErrorMessage(JSON.stringify(error.response.data));
          }
          setShowErrorModal(true); // 顯示錯誤模態對話框
          setShowModal(false); // 隱藏驗證碼模態對話框
        }
        console.log(error);
      });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };

  return (
    <section className="login-container sign-up-padding-top">
      <form method="post" className="signin-box">
        <h2>註冊會員</h2>
        <div className="input-box">
          <span className="icon">
            <ion-icon name="person"></ion-icon>
          </span>
          <input
            type="text"
            value={userName}
            onChange={handleUserNameChange}
            required
          />
          <label htmlFor="userName">姓名</label>
        </div>

        <div className="input-box">
          <span className="icon">
            <ion-icon name="person"></ion-icon>
          </span>
          <input
            type="text"
            value={account}
            onChange={handleAccountChange}
            required
          />
          <label htmlFor="account">帳號</label>
        </div>
        <div className="input-box">
          <span className="icon">
            <ion-icon name="lock-closed"></ion-icon>
          </span>
          <input
            type="password"
            value={passwd}
            onChange={handlePasswdChange}
            required
          />
          <label htmlFor="passwd">密碼</label>
        </div>
        <div className="input-box">
          {passwordError && (
            <div className="error-icon" title={passwordError}>
              <ion-icon name="alert-circle"></ion-icon>
            </div>
          )}
          <span className="icon">
            <ion-icon name="document-lock"></ion-icon>
          </span>
          <input
            type="password"
            value={confirmPassword}
            onChange={handleConfirmPasswdChange}
            required
          />
          <label htmlFor="confirmPassword">確認密碼</label>
        </div>
        <div className="input-box">
          <span className="icon">
            <ion-icon name="mail-sharp"></ion-icon>
          </span>
          <input
            type="text"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <label htmlFor="email">信箱</label>
        </div>
        {userNameError && <div className="error-message">{userNameError}</div>}
        {accountError && <div className="error-message">{accountError}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {passwordError && <div className="error-message">{passwordError}</div>}
        {emailError && <div className="error-message">{emailError}</div>}

        <button className="signin-btn" onClick={handleSubmit}>
          發送驗證碼
        </button>

        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>驗證碼</Modal.Title>
          </Modal.Header>
          <Modal.Body
            className={
              isLargeScreen
                ? "custom-modal-content-lg"
                : "custom-modal-content-m"
            }
          >
            <Form.Group controlId="verificationCode">
              <Form.Label>請輸入驗證碼</Form.Label>
              <Form.Control
                type="text"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              關閉
            </Button>
            <Button variant="primary" onClick={handleRegister}>
              註冊
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showSuccessModal} onHide={handleCloseSuccessModal}>
          <Modal.Header closeButton>
            <Modal.Title>註冊成功</Modal.Title>
          </Modal.Header>
          <Modal.Body
            className={
              isLargeScreen
                ? "custom-modal-content-lg"
                : "custom-modal-content-m"
            }
          >
            註冊成功！即將跳轉到登入頁面...
          </Modal.Body>
        </Modal>

        <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
          <Modal.Header closeButton>
            <Modal.Title>驗證失敗</Modal.Title>
          </Modal.Header>
          <Modal.Body
            className={
              isLargeScreen
                ? "custom-modal-content-lg"
                : "custom-modal-content-m"
            }
          >
            驗證碼錯誤，請重新嘗試。
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseErrorModal}>
              關閉
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="login-link">
          <p>
            是否已有帳號?<a href="/login">登入</a>
          </p>
        </div>
      </form>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </section>
  );
};

export default Info;
