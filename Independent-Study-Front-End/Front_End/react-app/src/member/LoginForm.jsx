// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './LoginForm.css';

// const LoginForm = () => {
//     const [userGmail, setUserGmail] = useState('');
//     const [userPassword, setUserPassword] = useState('');
//     const [rememberMe, setRememberMe] = useState(false);
//     const [error, setError] = useState('');
//     const [loginMessage, setLoginMessage] = useState('');
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!userGmail || !userPassword) {
//             setError('請輸入帳號和密碼');
//             return;
//         }
//         setError('');
//         setLoginMessage('');

//         try {
//             const response = await axios.post('http://localhost:8080/login', {
//                 gmail: userGmail,
//                 password: userPassword
//             });
//             setLoginMessage(response.data);
//             alert(response.data);
//             navigate('/UserProfile'); // 登錄成功後跳轉到主頁
//         } catch (error) {
//             if (error.response) {
//                 setError(error.response.data);
//                 alert(error.response.data);
//             } else if (error.request) {
//                 setError('無法連接到服務器');
//             } else {
//                 setError('請求發生錯誤');
//                 console.log('登入失敗');
//             }
//         }
//     };

//     return (
//         <div className="login-form-container">
//             <h2>會員登入</h2>
//             {error && <p className="error">{error}</p>}
//             {loginMessage && <p className="login-message">{loginMessage}</p>}
//             <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                     <label htmlFor="gmail">帳號或電子郵件</label>
//                     <input
//                         type="text"
//                         id="gmail"
//                         value={userGmail}
//                         onChange={(e) => setUserGmail(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="password">密碼</label>
//                     <input
//                         type="password"
//                         id="password"
//                         value={userPassword}
//                         onChange={(e) => setUserPassword(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div className="form-group checkbox-group">
//                     <input
//                         type="checkbox"
//                         id="rememberMe"
//                         checked={rememberMe}
//                         onChange={(e) => setRememberMe(e.target.checked)}
//                     />
//                     <label htmlFor="rememberMe">記住我</label>
//                 </div>
//                 <button type="submit" className="submit-button">登入</button>
//                 <div className="form-links">
//                     <a href="/forgot-password">忘記密碼?</a>
//                     <a href="/register" className="register-link">註冊</a>
//                 </div>
//                 <div className="social-login">
//                     <button type="button" className="google-login" onClick={() => console.log('Google 登入')}>使用 Google 登入</button>
//                     <button type="button" className="facebook-login" onClick={() => console.log('Facebook 登入')}>使用 Facebook 登入</button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default LoginForm;
