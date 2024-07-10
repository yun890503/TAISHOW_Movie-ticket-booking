package com.taishow.service.client;

import com.taishow.dao.BonusDao;
import com.taishow.dto.BonusDetailDto;
import com.taishow.entity.*;
import com.taishow.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BonusService {

    @Autowired
    private BonusDao bonusDao;

    @Autowired
    private JwtUtil jwtUtil;

    public List<BonusDetailDto> getBonusByToken(String token) {
        Integer userId = jwtUtil.getUserIdFromToken(token);
        List<Object[]> results = bonusDao.findBonusDetailByUserId(userId);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        List<BonusDetailDto> bonusDetailDtoList = new ArrayList<>();
        for (Object[] result : results) {
            BonusDetailDto dto = new BonusDetailDto();
            dto.setBonusId((Integer) result[0]);

            // 處理 orderDate
            Timestamp orderDateTimestamp = (Timestamp) result[1];
            if (orderDateTimestamp != null) {
                LocalDateTime orderDateTime = orderDateTimestamp.toLocalDateTime();
                String orderDateString = orderDateTime.format(formatter);
                dto.setOrderDate(orderDateString);
            }

            dto.setBonus((Integer) result[2]);

            // 處理 showTime
            Timestamp showTimeTimestamp = (Timestamp) result[3];
            if (showTimeTimestamp != null) {
                LocalDateTime showTimeDateTime = showTimeTimestamp.toLocalDateTime();
                String showTimeString = showTimeDateTime.format(formatter);
                dto.setShowTime(showTimeString);
            }

            dto.setTitle((String) result[4]);
            dto.setTheaterName((String) result[5]);
            dto.setScreenName((String) result[6]);
            dto.setPayway((String) result[7]);
            dto.setPayStatus((String) result[8]);

            bonusDetailDtoList.add(dto);
        }

        return bonusDetailDtoList;
    }
}
