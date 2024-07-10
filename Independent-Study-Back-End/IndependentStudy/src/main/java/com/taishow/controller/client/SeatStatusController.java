package com.taishow.controller.client;

import com.taishow.dto.SeatStatusDto;
import com.taishow.entity.SeatStatus;
import com.taishow.service.client.SeatStatusService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/seat-status")
public class SeatStatusController {

    private static final Logger logger = LoggerFactory.getLogger(SeatStatusController.class);

    @Autowired
    private SeatStatusService seatStatusService;

    @GetMapping
    public List<SeatStatusDto> getSeatStatus(
            @RequestParam String theaterName,
            @RequestParam String screenName,
            @RequestParam LocalDateTime showTime) {

        return seatStatusService.getSeatStatus(theaterName, screenName,  showTime);

    }
    @PostMapping
    public ResponseEntity<?> reserveSeats(@RequestBody List<SeatStatus> seatStatuses) {
        LocalDateTime currentDateTime = LocalDateTime.now(); // 获取当前时间
        for (SeatStatus seatStatus : seatStatuses) {
            seatStatus.setCreateAt(currentDateTime); // 设置 createAt 时间为当前时间
            if (seatStatus.getSeatId() == null) {
                logger.error("Invalid SeatStatus: {}", seatStatus);
                return ResponseEntity.badRequest().body("seatID cannot be null");
            }

        }

        try {
            List<Integer> reservedSeatIds = seatStatusService.reserveSeats(seatStatuses);
            return ResponseEntity.ok(reservedSeatIds); // 成功时返回整数列表
        } catch (IllegalStateException e) {
            // 返回座位已被选取的错误信息
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage()); // 返回错误消息字符串
        } catch (IllegalArgumentException e) {
            // 返回非法参数的错误信息
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage()); // 返回错误消息字符串
        }
    }

    // 捕获全局范围内的异常
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalStateException(IllegalStateException e) {
        // 座位已被选取，返回状态码 409 (Conflict)
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        // 非法参数，返回状态码 400 (Bad Request)
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

}

