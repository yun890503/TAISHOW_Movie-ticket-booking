import Cookies from 'js-cookie' //npm install js-cookie

export const fetchUsers = async () => {
  const token = Cookies.get('token');
  const getUserURL = 'http://localhost:8080/user/getAll'
  if(!token){
    alert("無使用權限");
    return;
  }
  try{
    const res = await fetch(getUserURL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if(!res.ok){
      throw new Error(`HTTP 錯誤, Status: ${res.status}`);
    } 
    const data = await res.json();
    return data.data;
    
  }catch(error){
    console.error('Error fetching user data:', error);
    return[];
  }
};

// 待程式被呼叫將userData資料傳入 => 對抓取的資料做映射處理
export const getUsers = (userData) => {
  return userData.map(user => ({
    id: user.usersId,
    nickName: user.nickName,
    account: user.account,
    birthday: user.birthday,
    phone: user.phone,
    email: user.email,
    gender: user.gender,
  }));
};
    

