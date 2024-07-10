import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import MovieInfomation from "./SeatMovieInfomation";
import SeatSelector from "./SeatSelector";
import './Seat.css';
import { BookingContext } from "../Context/BookingContext"; // 引入 BookingContext

const SeatLayout = () => {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [statusLoaded, setStatusLoaded] = useState(false);
  const seatsRef = useRef([]);
  const initialLoadRef = useRef(true);
  const { bookingData, updateBookingData } = useContext(BookingContext); 
  const [movieInfomation, setMovieInfomation] = useState({
    theaterName: bookingData.theaterName,
    movieName: bookingData.title,
    movieImage: bookingData.poster,
    showTime: bookingData.showTime,
    showtime_id: bookingData.showTimeId,
    screen: bookingData.screenName,
    screen_id: bookingData.screenId,
    seat: selectedSeats.map(seat => `${seat.row_num}排, ${seat.seat_number}號`),
    quantity: selectedSeats.length,
  });
  console.log(bookingData);
  const convertTo2DArray = (data) => {
    const rows = {};
    data.forEach(seat => {
      if (!rows[seat.row_num]) {
        rows[seat.row_num] = [];
      }
      rows[seat.row_num].push(seat);
    });
    return Object.values(rows);
  };

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;

      const fetchSeatLayoutAndStatus = async () => {
        try {
          // Fetch seat layout
          const layoutResponse = await axios.get(`http://localhost:8080/seat-layout?theaterName=${movieInfomation.theaterName}&screenName=${movieInfomation.screen}`);
          const layoutData = layoutResponse.data;
          console.log("Layout Data:", layoutData);

          const initialLayout = layoutData.map(seat => ({
            ...seat,
            status: seat.is_aisle ? 'aisle' : 'available',
            showtime_id: bookingData.showTimeId,
          }));
          console.log("Initial Layout with Aisle Status:", initialLayout);

          seatsRef.current = initialLayout;
          setSeats(initialLayout);
          console.log("Initial Layout:", initialLayout);

          // Fetch seat status
          const statusResponse = await axios.get(`http://localhost:8080/seat-status?theaterName=${movieInfomation.theaterName}&screenName=${movieInfomation.screen}&showTime=${movieInfomation.showTime}`);
          const statusData = statusResponse.data;
          console.log("Status Data:", statusData);

          // Update seat status
          const updatedLayout = initialLayout.map(seat => {
            const statusSeat = statusData.find(s => s.seat_number === seat.seat_number && s.row_num === seat.row_num);
            console.log("statusSeat for seat", seat.row_num, seat.seat_number, ":", statusSeat);
            if (statusSeat) {
                return { ...seat, status: statusSeat.seat_status };
            }
            return seat;
        });

          seatsRef.current = updatedLayout;
          setSeats(updatedLayout);
          setStatusLoaded(true); // Mark status as loaded

          // Update movie information
          if (statusData.length > 0) {
            const { title, poster } = statusData[0];
            setMovieInfomation(prevState => ({
              ...prevState,
              movieName: title,
              movieImage: poster
            }));

            // 更新上下文中的 title 和 poster
            updateBookingData({
              title: title, // 更新上下文中的 title
              poster: poster // 更新上下文中的 poster
            });
          }

          // Print updated layout after status update
          console.log("Updated Layout After Status:", updatedLayout);

        } catch (error) {
          console.error("Error fetching seat layout or status:", error);
        }
      };

      fetchSeatLayoutAndStatus();
    }
  }, [movieInfomation.theaterName, movieInfomation.screen, movieInfomation.showTime]);

  const toggleSeat = (seatToToggle) => {
    const newSeatsArray = seatsRef.current.map(seat => {
      if (seat.row_num === seatToToggle.row_num && seat.seat_number === seatToToggle.seat_number) {
        switch (seat.status) {
          case 'available':
            if (selectedSeats.length < 6) {
              return { ...seat, status: 'selected' };
            } else {
              alert("You can't select more than 6 seats!");
              return seat;
            }
          case 'selected':
            return { ...seat, status: 'available' };
          case 'reserved':
          case 'unavailable':
            return seat;
          default:
            return seat;
        }
      }
      return seat;
    });

    const newSelectedSeats = newSeatsArray.filter(seat => seat.status === "selected");
    seatsRef.current = newSeatsArray; // Update useRef
    setSeats(newSeatsArray);
    setSelectedSeats(newSelectedSeats);

    // Update seat information
    setMovieInfomation(prevState => ({
      ...prevState,
      seat: newSelectedSeats.map(seat => `${seat.row_num}排, ${seat.seat_number}號`),
      quantity: newSelectedSeats.length
    }));
  };

  // If status has not loaded yet, show loading
  if (!statusLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bb">
      <MovieInfomation movieInfomation={movieInfomation} />
      <SeatSelector seats={convertTo2DArray(seats)} toggleSeat={toggleSeat} />
    </div>
  );
};

export default SeatLayout;
