package com.taishow.util;

import com.taishow.service.client.OrderService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class OrderCancellationScheduler {

    private final OrderService orderService;

    public OrderCancellationScheduler(OrderService orderService) {
        this.orderService = orderService;
    }

    @Scheduled(fixedDelay = 60000)
    public void cancelOrders() {
        System.out.println("Executing cancelOrders()");
        orderService.checkAndCancelOrders();
    }
}
