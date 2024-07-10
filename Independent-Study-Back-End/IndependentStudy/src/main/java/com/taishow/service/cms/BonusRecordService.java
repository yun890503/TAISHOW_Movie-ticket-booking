package com.taishow.service.cms;

import com.taishow.dao.OrderRepository;
import com.taishow.dto.OrderRecordDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BonusRecordService {

    private final OrderRepository orderRepository;

    public BonusRecordService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<OrderRecordDto> getAllBonusRecord(){
        List<Object[]> results = orderRepository.getAllBonusRecord();
        return results.stream().map(this::convertToOrderRecordDto).collect(Collectors.toList());
    }

    private OrderRecordDto convertToOrderRecordDto(Object[] record) {
        return new OrderRecordDto(
                (String) record[0],  // orderNum
                (String) record[1],  // account
                (Integer) record[2], // totalAmount
                (Integer) record[3], // bonus
                (String) record[4],  // payway
                (String) record[5]   // payStatus
        );
    }
}
