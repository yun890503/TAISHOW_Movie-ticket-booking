package com.taishow.controller.client;

import com.taishow.dto.OrderDto;
import com.taishow.entity.TicketType;
import com.taishow.service.client.OrderService;
import com.taishow.util.JwtUtil;
import ecpay.payment.integration.AllInOne;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Hashtable;
import java.util.List;
import java.util.Map;

@RestController
public class OrderController {

    private final OrderService orderService;

    private final JwtUtil jwtUtil;

    public OrderController(OrderService orderService, JwtUtil jwtUtil) {
        this.orderService = orderService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/booking/{movieId}/order")
    public ResponseEntity<List<TicketType>> getTicketTypeDetail(@PathVariable Integer movieId){
        List<TicketType> ticketTypeList = orderService.getTicketTypeDetail(movieId);
        if (!ticketTypeList.isEmpty()){
            return ResponseEntity.status(HttpStatus.OK).body(ticketTypeList);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/booking/{movieId}/order")
    public ResponseEntity<String> createOrder(@RequestHeader("Authorization") String token,
                                              @RequestBody OrderDto orderDto,
                                              @PathVariable Integer movieId){
        try {
             Integer userId = null;
             if (token != null && token.startsWith("Bearer ")) {
                 token = token.substring(7);
                 userId = jwtUtil.getUserIdFromToken(token);
             } else {
                 throw new IllegalArgumentException("Invalid Authorization header");
             }

            // 檢查訂單資訊
            orderService.checkOrderInformation(orderDto, movieId);

            // 訂單寫入資料庫
            Map<String, String> orderDetail = orderService.createOrder(orderDto, movieId, userId);

            // 僅使用紅利點數購票，不須送綠界付款
            if ("0".equals(orderDetail.get("totalPrice"))){
                return ResponseEntity.status(HttpStatus.CREATED).build();
            }

            String aioCheckOutALLForm = orderService.ecpayCheckout(orderDetail);
            return ResponseEntity.status(HttpStatus.CREATED).body(aioCheckOutALLForm);
        } catch (Exception e){
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("建立訂單失敗: " + e.getMessage());
        }
    }

    @PostMapping("/ecpayCallback")
    public ResponseEntity<String> handleEcpayCallback(@RequestParam Map<String, String> callbackData){

        Hashtable<String, String> hashtable = new Hashtable<>(callbackData);

        AllInOne allInOne = new AllInOne("");

        if (!allInOne.compareCheckMacValue(hashtable)){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid CheckMacValue");
        }

        if (orderService.isOrderCancel(hashtable)){
            return generateAlertResponse("訂單已被取消，若有疑問請聯絡客服");
        }

        try {
            if ("1".equals(callbackData.get("RtnCode"))){
                orderService.paymentSuccess(hashtable);
                return generateAlertResponse("付款成功");
            } else {
                orderService.paymentFailure(hashtable);
                return generateAlertResponse("付款失敗");
            }
        } catch (Exception e){
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("建立訂單失敗: " + e.getMessage());
        }
    }

    private ResponseEntity<String> generateAlertResponse(String message) {
        String htmlResponse = "<!DOCTYPE html><html><body><script type=\"text/javascript\">" +
                "alert('" + message + "');" +
                "window.close();" +
                "</script></body></html>";
        return ResponseEntity.status(HttpStatus.OK).body(htmlResponse);
    }
}
