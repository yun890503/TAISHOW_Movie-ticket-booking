package com.taishow.service.cms;

import com.taishow.dao.*;
import com.taishow.dto.OrderRecordDetailDto;
import com.taishow.dto.OrderRecordDto;
import com.taishow.dto.TicketDetailDto;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RefundRecordService {

    private final OrderRepository orderRepository;

    public RefundRecordService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<OrderRecordDto> getAllRefundRecord(){
        List<Object[]> results = orderRepository.getAllOrderRecordByMethod("退款");
        return results.stream().map(this::convertToOrderRecordDto).collect(Collectors.toList());
    }

    private OrderRecordDto convertToOrderRecordDto(Object[] record) {
        return new OrderRecordDto(
                (String) record[0],  // orderNum
                (String) record[1],  // account
                (Integer) record[2], // totalAmount
                Math.toIntExact((Long) record[3]), // bonus
                (String) record[4],  // payway
                (String) record[5]   // payStatus
        );
    }

    public OrderRecordDetailDto getRefundRecordDetail(String orderNum){
        List<Object[]> results = orderRepository.getOrderRecordDetailByOrderNumAndMethod(orderNum, "退款");

        if (results.isEmpty()) {
            return null;
        }

        OrderRecordDetailDto orderRecordDetailDto = new OrderRecordDetailDto();
        List<TicketDetailDto> ticketDetailList = new ArrayList<>();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        for (Object[] result : results) {
            if (orderRecordDetailDto.getOrderNum() == null) {
                orderRecordDetailDto.setOrderNum((String) result[0]);
                orderRecordDetailDto.setOrderDate(dateFormat.format((Timestamp) result[1]));
                orderRecordDetailDto.setAccount((String) result[2]);
                orderRecordDetailDto.setTotalAmount((Integer) result[3]);
                orderRecordDetailDto.setBonus(Math.toIntExact((Long) result[4]));
                orderRecordDetailDto.setQrcode((String) result[5]);
                orderRecordDetailDto.setTitle((String) result[6]);
                orderRecordDetailDto.setShowTime(dateFormat.format((Timestamp) result[7]));
                orderRecordDetailDto.setPayway((String) result[12]);
                orderRecordDetailDto.setPayStatus((String) result[13]);
                orderRecordDetailDto.setPayTime(result[14] != null ? dateFormat.format((Timestamp) result[14]) : null);
                orderRecordDetailDto.setModifyTime(dateFormat.format((Timestamp) result[15]));
            }

            TicketDetailDto ticketDetailDto = new TicketDetailDto();
            ticketDetailDto.setTicketType((String) result[8]);
            ticketDetailDto.setRowNum((Integer) result[9]);
            ticketDetailDto.setSeatNum((Integer) result[10]);
            ticketDetailDto.setUnitPrice((Integer) result[11]);

            ticketDetailList.add(ticketDetailDto);
        }

        orderRecordDetailDto.setTicketDetailList(ticketDetailList);

        return orderRecordDetailDto;
    }
}
