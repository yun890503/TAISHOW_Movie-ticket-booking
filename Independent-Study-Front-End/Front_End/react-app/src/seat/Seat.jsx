import React from 'react';
import './Seat.css'; // 如果你创建了一些CSS样式

const Seat = ({ seat, toggleSeat }) => {
    // 根据座位状态分配CSS类名
    const getSeatClass = (status) => {
        switch(status) {
            case 'available':
                return 'seat available';
            case 'selected':
                return 'seat selected';
            case 'taken':
                return 'seat taken';
            case 'aisle':
                return 'seat aisle';
            default:
                return 'seat';
        }
    }
    const handleSeatClick = () => {
        toggleSeat(seat);
      };

    return (
        <button className={getSeatClass(seat.status)} onClick={handleSeatClick}>
             {seat.row_num},  {seat.seat_number}
        </button>
    );
};

export default Seat;