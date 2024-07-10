package com.taishow.service.client;

import com.taishow.dao.SeatStatusRepository;
import com.taishow.dto.SeatStatusDto;
import com.taishow.entity.SeatStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatStatusService {

    @Autowired
    private SeatStatusRepository seatStatusRepository;

    private final Object lock = new Object(); // 鎖對象

    public List<SeatStatusDto> getSeatStatus(String theaterName, String screenName,  LocalDateTime showTime){

        List<Object[]> results = seatStatusRepository.findSeatStatus(theaterName, screenName,  showTime);
        return results.stream()
                .map(result -> {
//                      // 調試信息：打印每個字段的類型
//                      System.out.println("Theater Name: " + result[0].getClass().getName());
//                      System.out.println("Screen Name: " + result[1].getClass().getName());
//                      System.out.println("Row Num: " + result[2].getClass().getName());
//                      System.out.println("Seat Number: " + result[3].getClass().getName());
//                      System.out.println("Status: " + result[4].getClass().getName());
//                      System.out.println("Showtime: " + result[5].getClass().getName());
//                      System.out.println("Seat Status: " + result[6].getClass().getName());
//                      System.out.println("Seat Status: " + result[7].getClass().getName());
//                      System.out.println("Movie Title: " + result[8].getClass().getName());
//                      System.out.println("Movie Poster: " + result[9].getClass().getName());

                    return new SeatStatusDto(
                            (String) result[0], // theater_name
                            (String) result[1], // screen_name
                            (String) result[4], // seat_status
                            convertToLocalDateTime(result[5]), // showtime
                            (Integer) result[2],  // row_num
                            (Integer) result[3], // seat_number      陣列的值會長這樣是因為SQL查詢順序
                            (Integer) result[6], // seat_id
                            (Integer) result[7],  // showtime_id
                            (String)  result[8],  // movie.title
                            (String)  result[9]   // movie.poster

                    );
                })
                .collect(Collectors.toList());
    }

    private LocalDateTime convertToLocalDateTime(Object dateObject) {
        if (dateObject instanceof LocalDateTime) {
            return (LocalDateTime) dateObject;
        } else if (dateObject instanceof String) {
            return LocalDateTime.parse((String) dateObject, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        } else if (dateObject instanceof java.sql.Timestamp) {
            return ((java.sql.Timestamp) dateObject).toLocalDateTime();
        } else {
            throw new IllegalArgumentException("Unsupported date type: " + dateObject.getClass().getName());
        }
    }
    @Transactional // 確保整個方法在一個事務中執行，保證數據一致性
    public List<Integer> reserveSeats(List<SeatStatus> seatStatuses) {
        List<Integer> reservedSeatIds = new ArrayList<>(); // 用於存儲已預訂座位的ID

        for (SeatStatus seatStatus : seatStatuses) { // 遍歷所有需要預訂的座位狀態
            if (seatStatus.getSeatId() != null && seatStatus.getShowTimeId() != null) { // 檢查 seatId 和 showtimeId 是否為空
                synchronized (lock) { // 同步塊，確保同一時刻只有一個線程可以進入此塊，避免並發問題
                    SeatStatus existingSeatStatus = seatStatusRepository.findBySeatIdAndShowTimeId(seatStatus.getSeatId(), seatStatus.getShowTimeId());
//                    if (existingSeatStatus != null) {
//                        System.out.println("ID: " + existingSeatStatus.getId());
//                        System.out.println("Seat ID: " + existingSeatStatus.getSeatId());
//                        System.out.println("Show Time ID: " + existingSeatStatus.getShowTimeId());
//                        System.out.println("Status: " + existingSeatStatus.getStatus());
//                        System.out.println("Created At: " + existingSeatStatus.getCreateAt());
//                    } else {
//                        System.out.println("No SeatStatus found for the given seatId and showTimeId.");
//                    }
                    // 查找數據庫中是否已有該座位和場次的狀態信息

                    if (existingSeatStatus != null) { // 如果座位狀態信息已存在
                        if ("available".equals(existingSeatStatus.getStatus())) {
                            // 如果座位狀態是 "available"，則可以預訂
                            existingSeatStatus.setStatus("taken"); // 將狀態設置為 "taken"
                            existingSeatStatus.setCreateAt(LocalDateTime.now()); // 更新創建時間為當前時間
                            seatStatusRepository.saveAndFlush(existingSeatStatus);
                            // 使用 saveAndFlush 確保更改立即寫入數據庫，避免延遲
                            reservedSeatIds.add(existingSeatStatus.getId()); // 將預訂的座位ID添加到列表
                        } else {
                            throw new IllegalStateException("座位已被選取");
                            // 如果座位狀態不是 "available"，則拋出異常
                        }
                    } else {
                        // 如果座位狀態信息不存在，說明是新座位，直接保存新的狀態
                        seatStatus.setCreateAt(LocalDateTime.now()); // 設置創建時間為當前時間
                        SeatStatus savedSeatStatus = seatStatusRepository.saveAndFlush(seatStatus);
                        // 保存並立即刷新到數據庫，確保數據一致性
                        reservedSeatIds.add(savedSeatStatus.getId()); // 將預訂的座位ID添加到列表
                    }
                } // 同步塊結束
            } else {
                throw new IllegalArgumentException("seatId and showtimeId cannot be null");
                // 如果 seatId 或 showtimeId 為空，拋出非法參數異常
            }
        }
        return reservedSeatIds; // 返回预订的座位ID列表
    }
    // 定時任務：每50秒檢查一次支付狀態並更新座位狀態
    @Scheduled(fixedRate = 50000)
    public void checkPaymentStatus() {
        LocalDateTime now = LocalDateTime.now();
        List<SeatStatus> seatStatusList = seatStatusRepository.findAll();

        for (SeatStatus seatStatus : seatStatusList) {
            LocalDateTime createAt = seatStatus.getCreateAt();
            // 如果座位已經超過10分鐘未支付，則處理座位狀態
            if (createAt != null && now.isAfter(createAt.plusMinutes(10))) {
                processSeatStatus(seatStatus);
            }
        }
    }

    // 非同步方法：處理單個座位的支付狀態
    @Async
    public void processSeatStatus(SeatStatus seatStatus) {
        Integer seatStatusId = seatStatus.getId();
        List<String> payStatusList = seatStatusRepository.getPayStatusById1(seatStatusId);

        if (payStatusList.isEmpty()) {
//            System.out.println("No payment data for seat status ID: " + seatStatusId);
            updateSeatStatusToAvailable(seatStatus);
        } else {
            String payStatus = payStatusList.get(0);
            switch (payStatus) {
                case "已退款":
//                    System.out.println("Payment refunded for seat status ID: " + seatStatusId);
                    updateSeatStatusToAvailable(seatStatus);
                    break;
                case "付款失敗":
//                    System.out.println("Payment failed for seat status ID: " + seatStatusId);
                    updateSeatStatusToAvailable(seatStatus);
                    break;
                case "已取消":
//                    System.out.println("Payment cancelled for seat status ID: " + seatStatusId);
                    // 不再需要更新座位狀態為"cancelled"
                    break;
                default:
//                    System.out.println("Payment status: " + payStatus + " for seat status ID: " + seatStatusId);
                    // 處理其他支付狀態的情況
                    break;
            }
        }
    }

    // 更新座位狀態為"available"
    private void updateSeatStatusToAvailable(SeatStatus seatStatus) {
        seatStatus.setStatus("available");
        seatStatusRepository.save(seatStatus);
    }


}

