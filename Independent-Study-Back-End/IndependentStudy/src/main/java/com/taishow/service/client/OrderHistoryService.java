package com.taishow.service.client;

import com.taishow.dao.OrderDao;
import com.taishow.dto.OrderHistoryDto;
import com.taishow.dto.Result;
import com.taishow.entity.*;
import com.taishow.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class OrderHistoryService {
    @Autowired
    private JwtUtil jwtUtil;
    private OrderDao orderDao;

    public OrderHistoryService(OrderDao orderDao) {
        this.orderDao = orderDao;
    }

    public Result createOrder(Orders orders){
        orderDao.save(orders);
        return new Result(200, "success");
    }
    public Result updateOder(Orders orders){
        orderDao.save(orders);
        return new Result(200, "success");
    }
    public Result deleteOrder(Integer id){
        orderDao.deleteById(id);
        return new Result(200, "success");
    }
    public Result getOrder(Integer id){
        Optional<Orders> optionalOrders = orderDao.findById(id);
        if(optionalOrders.isPresent()){
            return new Result(200, optionalOrders.get());
        }else{
            return new Result(9999, "no data");
        }
    }

    public List<OrderHistoryDto> getOrdersPaymentsTicketsShowtimeMovieScreenAndTheaterByToken(String token) {
        Integer userId = jwtUtil.getUserIdFromToken(token);
        List<Object[]> results = orderDao.findOrderDetailByUserId(userId);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        List<OrderHistoryDto> orderHistoryDtoList = new ArrayList<>();
        for (Object[] result : results) {
            OrderHistoryDto dto = new OrderHistoryDto();
            dto.setPaymentId((Integer) result[0]);
            dto.setOrderNum((String) result[1]);

            Timestamp orderDateTimestamp = (Timestamp) result[2];
            if (orderDateTimestamp != null) {
                LocalDateTime orderDateTime = orderDateTimestamp.toLocalDateTime();
                String orderDateString = orderDateTime.format(formatter);
                dto.setOrderDate(orderDateString);
            }

            dto.setTotalAmount((Integer) result[3]);
            dto.setTitle((String) result[4]);

            Timestamp showTimeTimestamp = (Timestamp) result[5];
            if (showTimeTimestamp != null) {
                LocalDateTime showTimeDateTime = showTimeTimestamp.toLocalDateTime();
                String showTimeString = showTimeDateTime.format(formatter);
                dto.setShowTime(showTimeString);
            }

            dto.setTheaterName((String) result[6]);
            dto.setScreenName((String) result[7]);
            dto.setPayStatus((String) result[8]);
            dto.setQrcode((String) result[9]);
            dto.setMethod((String) result[10]);

            orderHistoryDtoList.add(dto);
        }
        return orderHistoryDtoList;
    }

}
