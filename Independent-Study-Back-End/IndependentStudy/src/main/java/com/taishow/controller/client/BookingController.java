package com.taishow.controller.client;

import com.taishow.dto.BookingDto;
import com.taishow.service.client.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BookingController {

    private BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/booking/{movieId}")
    public ResponseEntity<List<BookingDto>> getWeekShowById(@PathVariable Integer movieId){
        List<BookingDto> bookingDtoList = bookingService.getWeekShowById(movieId);

        if (!bookingDtoList.isEmpty()){
            return ResponseEntity.status(HttpStatus.OK).body(bookingDtoList);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
