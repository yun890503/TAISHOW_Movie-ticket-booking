import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Overview from "./pages/Overview";
import RatingOverview from "./pages/ReviewOverview";
import Footer from "./components/Footer";
import TheaterInfomation from "./TheaterInfomation/TheaterInfomation";
import OrderLayout from "./Order/OrderLayout";
import Booking from "./Booking/Booking";
import SignUp from "./pages/SignUp";
import { ChakraProvider } from "@chakra-ui/react";
import SeatLayout from "./seat/SeatLayout";
import CommentSection from "./pages/CommentSection";
import Profile from "./member/Member/Profile";
import Password from "./member/Member/Password";
import Orderlist from "./member/Member/Orderlist";
import BonusPointsList from "./member/Member/BonusPointsList";
import FavoritesList from "./member/Member/FavoritesList";
import Login from "./pages/Login";
import Movie from "./pages/Movie";
import { BookingProvider } from "./Context/BookingContext";
import ScrollToTop from "./ScrollToTop";

function App() {
  return (
    <ChakraProvider>
      <NavBar />
      <BookingProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Overview />} />
          <Route path="/movies/:movieId" element={<Movie />} />
          <Route path="/theaters" element={<TheaterInfomation />} />
          <Route path="/booking/:movieId/order" element={<OrderLayout />} />
          <Route path="/booking/:movieId" element={<Booking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/booking/:movieId/seats" element={<SeatLayout />} />

          <Route path="/reviews/:movieId" element={<CommentSection />} />
          <Route path="/reviews" element={<RatingOverview />} />
          <Route path="/member" element={<Profile />} />
          <Route path="/password" element={<Password />} />
          <Route path="/orderlist" element={<Orderlist />} />
          <Route path="/point" element={<BonusPointsList />} />
          <Route path="/favorite" element={<FavoritesList />} />
        </Routes>
      </BookingProvider>
      <Footer />
    </ChakraProvider>
  );
}

export default App;
