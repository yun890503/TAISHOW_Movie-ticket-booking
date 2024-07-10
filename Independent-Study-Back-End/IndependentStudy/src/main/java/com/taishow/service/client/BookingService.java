package com.taishow.service.client;

import com.taishow.dao.BookingRepository;
import com.taishow.dto.BookingDto;
import com.taishow.dto.ShowsDto;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.*;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public List<BookingDto> getWeekShowById(Integer movieId){
        LocalDate endDateLocal = LocalDate.now().plusWeeks(1);
        java.sql.Date endDate = java.sql.Date.valueOf(endDateLocal);

        List<Object[]> results = bookingRepository.getWeekShowById(movieId, endDate);
        Map<Integer, BookingDto> bookingMap = new HashMap<>();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        for (Object[] result : results) {
            Integer theaterId = (Integer) result[0];
            String theaterName = (String) result[1];
            String address = (String) result[2];
            Integer showTimeId = (Integer) result[3];
            String showTime = dateFormat.format(result[4]);
            Integer screenId = (Integer) result[5];
            String screenName = (String) result[6];
            String screenClass = (String) result[7];

            ShowsDto showsDto = new ShowsDto();
            showsDto.setShowTimeId(showTimeId);
            showsDto.setShowTime(showTime);
            showsDto.setScreenId(screenId);
            showsDto.setScreenName(screenName);
            showsDto.setScreenClass(screenClass);

            BookingDto bookingDto = bookingMap.get(theaterId);
            if (bookingDto == null) {
                bookingDto = new BookingDto();
                bookingDto.setTheaterId(theaterId);
                bookingDto.setTheaterName(theaterName);
                bookingDto.setAddress(address);
                bookingDto.setshowList(new ArrayList<>());
                bookingMap.put(theaterId, bookingDto);
            }
            bookingDto.getshowList().add(showsDto);
        }

        return new ArrayList<>(bookingMap.values());
    }
}
