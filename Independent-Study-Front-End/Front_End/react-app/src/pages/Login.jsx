import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Spinner, Box, Checkbox, Link, Text } from "@chakra-ui/react";
import { auth, provider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import "../pages/Loginpage.css";

const LOGIN_URL = "http://localhost:8080/user/login";

const Login = () => {
  const [account, setAccount] = useState("");
  const [passwd, setPasswd] = useState("");
  const [error, setError] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAccountChange = (e) => {
    setAccount(e.target.value);
  };

  const handlePasswdChange = (e) => {
    setPasswd(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account || !passwd) {
      setError("請輸入帳號和密碼");
      return;
    }
    setError("");
    setLoginMessage("");
    setLoading(true);
    try {
      const response = await axios.post(
        LOGIN_URL,
        {
          account: account,
          passwd: passwd,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      Cookies.set("token", response.data, { expires: 1 });
      // setLoginMessage('登錄成功');
      setTimeout(() => {
        setLoading(false); // 停止加載
        const redirectTo = location.state?.from?.pathname || "/";
        navigate(redirectTo); // 登錄成功後跳轉到上個頁面
      }, 1000);
    } catch (error) {
      setLoading(false); // 停止加載
      if (error.response) {
        const errorMsg =
          typeof error.response.data === "string"
            ? error.response.data
            : JSON.stringify(error.response.data);
        setError(errorMsg);
      } else if (error.request) {
        setError("無法連接到服務器");
      } else {
        setError("請求發生錯誤");
      }
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const displayName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;

      // 轉換圖片 URL 為 base64
      const toDataURL = async (url) => {
        try {
          const response = await fetch(
            `https://cors-anywhere.herokuapp.com/${url}`
          );
          const blob = await response.blob();
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
          });
        } catch (error) {
          console.error("Failed to fetch image:", error);
          throw error;
        }
      };

      const photoBase64 = await toDataURL(photoURL);

      const requestData = {
        userName: displayName,
        email: email,
        photo: photoBase64,
      };

      console.log("data:", requestData);
      const response = await axios.post(
        "http://localhost:8080/user/google-login",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      Cookies.set("token", response.data, { expires: 1 });
      // setLoginMessage('登錄成功');
      setTimeout(() => {
        setGoogleLoading(false); // 停止加載
        const redirectTo = location.state?.from?.pathname || "/";
        navigate(redirectTo); // 登錄成功後跳轉到上個頁面
      }, 1000);
      console.log("成功:", response.data);
    } catch (error) {
      setGoogleLoading(false); // 停止加載
      console.error("Google 登錄失敗：", error);
      setError("Google 登錄失敗，請稍後再試");
    }
  };

  return (
    <section className="login-container">
      <form method="post" className="login-box" onSubmit={handleSubmit}>
        <h2>會員登入</h2>
        <div className="input-box">
          <span className="icon">
            <ion-icon name="person"></ion-icon>
          </span>
          <input
            type="text"
            value={account}
            onChange={handleAccountChange}
            required
            disabled={loading} // 登錄中禁用輸入框
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
            disabled={loading} // 登錄中禁用輸入框
          />
          <label htmlFor="passwd">密碼</label>
        </div>

        <button className="login-btn" type="submit" disabled={loading}>
          {" "}
          {/* 登錄中禁用按鈕 */}
          {loading ? <Spinner size="sm" /> : "登入"}{" "}
          {/* 根據 loading 狀態顯示轉圈圈或"登入" */}
        </button>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          mt={5} // 設置與上方物件的距離
          mb={5} // 設置與下方物件的距離
        >
          <Checkbox isDisabled={loading} ml={10}>
            記住我
          </Checkbox>
          <Link href="#" mr={10}>
            忘記密碼?
          </Link>
        </Box>

        <Box className="google-login">
          <Button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            display="flex"
            alignItems="center"
            backgroundColor="#4285F4"
            color="white"
            border="1px solid #4285F4"
            _hover={{ backgroundColor: "#357ae8" }}
            _disabled={{ opacity: 0.6, cursor: "not-allowed" }}
            px={4}
            py={2}
            width="100%" // 確保按鈕寬度固定
            maxWidth="350px" // 您可以根據需要調整這個值
          >
            <Box mr={0}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="24px"
                height="24px"
              >
                <path
                  fill="#4285F4"
                  d="M24 9.5c3.4 0 6.2 1.2 8.3 3.2l6.1-6.1C34.5 2.9 29.6 0 24 0 14.6 0 6.6 5.8 2.7 14.1l7 5.4C11.4 12.1 17 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.6c-.5 2.5-2 4.6-4.2 6l6.4 5c3.7-3.4 5.7-8.5 5.7-14.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.7 29.5c-1-2.5-1.6-5.2-1.6-8s.6-5.5 1.6-8l-7-5.4C2.1 12.9 0 18.3 0 24s2.1 11.1 5.7 15.4l7-5.4z"
                />
                <path
                  fill="#EA4335"
                  d="M24 48c6.4 0 11.8-2.1 15.7-5.7l-6.4-5c-2.1 1.4-4.7 2.3-7.6 2.3-6 0-11.1-4.1-12.9-9.6l-7 5.4C6.6 42.2 14.6 48 24 48z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
            </Box>
            <Box width="300px" textAlign="center">
              {googleLoading ? (
                <Spinner size="sm" color="white" mr={1} />
              ) : (
                <Text color="white" mt={4}>
                  Sign up with Google
                </Text>
              )}
            </Box>
          </Button>
        </Box>

        <div className="register-link">
          <p>
            尚未有帳號？<a href="/signup">註冊</a>
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {loginMessage && <div className="success-message">{loginMessage}</div>}
      </form>
    </section>
  );
};

export default Login;
