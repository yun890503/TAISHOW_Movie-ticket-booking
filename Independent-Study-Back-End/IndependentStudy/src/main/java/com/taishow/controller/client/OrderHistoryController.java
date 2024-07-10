package com.taishow.controller.client;

import com.taishow.dto.OrderHistoryDto;
import com.taishow.dto.Result;
import com.taishow.entity.Orders;
import com.taishow.service.client.OrderHistoryService;
import com.taishow.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/order")
public class OrderHistoryController {
    @Autowired
    private JwtUtil jwtUtil;

    private OrderHistoryService orderHistoryService;

    public OrderHistoryController(OrderHistoryService orderHistoryService) {
        this.orderHistoryService = orderHistoryService;
    }

    @PostMapping("/createOrder")
    public Result createOrder(@RequestBody Orders orders){
        System.out.println(orders);
        return orderHistoryService.createOrder(orders);
    }
    @PutMapping("/updateOder")
    public Result updateOder(@RequestBody Orders orders){
        return orderHistoryService.updateOder(orders);
    }
    @DeleteMapping("/deleteOrder/{id}")
    public Result deleteOrder(@PathVariable Integer id){
        return orderHistoryService.deleteOrder(id);
    }
    @GetMapping("/getOrder/{id}")

    public Result getOrder(@PathVariable Integer id){
        return orderHistoryService.getOrder(id);
    }

    @GetMapping("/orderDetails")
    public List<OrderHistoryDto> getOrderDetails(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return orderHistoryService.getOrdersPaymentsTicketsShowtimeMovieScreenAndTheaterByToken(token);
    }
    }

