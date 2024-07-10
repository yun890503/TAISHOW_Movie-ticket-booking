import Cookies from 'js-cookie';

export const fetchRefunds = async () => {
  const refundURL = 'http://localhost:8080/refund-records';
  const token = Cookies.get('token');
  try {
    const res = await fetch(refundURL, {
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
    console.error('Error fetching refund data:', error);
    return [];
  }
};

export const getRefunds = (refundData) => {
  return refundData.map((refund) => ({
    orderNum: refund.orderNum,
    account: refund.account,
    totalAmount: refund.totalAmount,
    bonus: refund.bonus,
    payway: refund.payway,
    payStatus: refund.payStatus,
  }));
};
