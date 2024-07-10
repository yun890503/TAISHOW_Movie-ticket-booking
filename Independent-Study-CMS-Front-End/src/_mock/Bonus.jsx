import Cookies from 'js-cookie';

export const fetchBonus = async () => {
  const bonusURL = 'http://localhost:8080/bonus-records';
  const token = Cookies.get('token');
  if(!token){
    alert("無使用權限");
    return;
  }
  try {
    const res = await fetch(bonusURL, {
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
    console.error('Error fetching bonus data:', error);
    return [];
  }
};

export const getBonus = (bonusData) => {
  return bonusData.map((bonus) => ({
    orderNum: bonus.orderNum,
    account: bonus.account,
    totalAmount: bonus.totalAmount,
    bonus: bonus.bonus,
    payway: bonus.payway,
    payStatus: bonus.payStatus,
  }));
};
