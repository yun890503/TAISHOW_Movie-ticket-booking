package com.taishow.service.client;

import com.taishow.dto.SeatLayoutDto;
import com.taishow.dao.SeatLayoutRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatLayoutService {

    private static final Logger logger = LoggerFactory.getLogger(SeatLayoutService.class);

    @Autowired
    private SeatLayoutRepository seatLayoutRepository;



    public List<SeatLayoutDto> getSeatLayout(String theaterName, String screenName) {
        try{
            logger.info("Axiosing seat layout for theater : {} and screen : {} , theraterName, screenName");
            List<Object[]> results = seatLayoutRepository.findSeatLayout(theaterName, screenName);
            return results.stream()
                    .map(result -> new SeatLayoutDto(
                            (String) result[0],                                         //  theaterName
                            (String) result[1],                                         //  screenName
                            (Integer) result[2],                                        //  row_num
                            (Integer) result[3],                                        //  seat_number
                            (Boolean) result[4],                                        //  is_aisle
                            (Integer) result[5]                                        // seat_id
                                                                   // showtime_id
                    ))

                    .collect(Collectors.toList());
        }catch (Exception e){
            logger.error("Error Axiosing seat layout", e);
            throw new RuntimeException("Unable to Axiosing seat layout", e);

        }

    }
}
