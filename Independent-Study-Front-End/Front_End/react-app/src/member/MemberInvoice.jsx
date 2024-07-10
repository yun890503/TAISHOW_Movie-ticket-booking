// import React, { useEffect, useState } from 'react';
// import './MemberInvoice.css';

// const MemberInvoice = () => {
//   const [invoices, setInvoices] = useState([]);

//   useEffect(() => {
//     // 獲取會員載具的邏輯
//     fetch('/api/invoices')
//       .then((res) => res.json())
//       .then((data) => setInvoices(data));
//   }, []);

//   return (
//     <div className="member-invoice">
//       <h2>會員載具</h2>
//       <ul>
//         {invoices.map((invoice) => (
//           <li key={invoice.id}>
//             <p>載具號: {invoice.id}</p>
//             <p>日期: {invoice.date}</p>
//             <p>總金額: {invoice.total}</p>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default MemberInvoice;
