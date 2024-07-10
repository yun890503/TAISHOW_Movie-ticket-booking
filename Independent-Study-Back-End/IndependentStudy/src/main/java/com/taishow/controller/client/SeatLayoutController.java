package com.taishow.controller.client;

import com.taishow.dto.SeatLayoutDto;
import com.taishow.service.client.SeatLayoutService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/seat-layout")
public class SeatLayoutController {

    private static final Logger logger = LoggerFactory.getLogger(SeatLayoutController.class);

    @Autowired
    private SeatLayoutService seatLayoutService;

    @GetMapping
    public List<SeatLayoutDto> getSeatLayout(@RequestParam String theaterName,
                                             @RequestParam String screenName) {
        try{
            logger.info("Received request for seat layout for theater: {} and screen: {}", theaterName, screenName);
        }catch(Exception e){
            logger.error("Error retrieving seat layout", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Unable to retrieve seat layout", e);

        }



        return seatLayoutService.getSeatLayout(theaterName, screenName);
    }
}