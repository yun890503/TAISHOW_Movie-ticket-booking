import Cookies from 'js-cookie';

export const fetchPayments = async () => {
  const token = Cookies.get('token');
  const paymentURL = 'http://localhost:8080/payment-records';
  
  if(!token){
    alert("無使用權限");
    return;
  }
  try {
    const res = await fetch(paymentURL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if(!res.ok){
      throw new Error(`HTTP 錯誤, Status: ${res.status}`);
    }
    const data = await res.json();
    return data;

  } catch (error) {
    console.error('Error fetching payment data:', error);
    return [];
  }
};

export const getPayments = (paymentData) => {
  return paymentData.map((payment) => ({
    orderNum: payment.orderNum,
    account: payment.account,
    totalAmount: payment.totalAmount,
    bonus: payment.bonus,
    payway: payment.payway,
    payStatus: payment.payStatus,
    showTime: payment.showTime,
    refunded: payment.refunded,
  }));
};
