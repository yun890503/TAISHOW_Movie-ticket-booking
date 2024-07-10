package com.taishow.controller.cms;

import com.taishow.dto.OrderRecordDetailDto;
import com.taishow.dto.OrderRecordDto;
import com.taishow.dto.PaymentRecordDto;
import com.taishow.service.cms.PaymentRecordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class PaymentRecordController {

    private PaymentRecordService paymentRecordService;

    public PaymentRecordController(PaymentRecordService paymentRecordService) {
        this.paymentRecordService = paymentRecordService;
    }

    @GetMapping("/payment-records")
    public ResponseEntity<List<PaymentRecordDto>> getAllPaymentRecord(){
        List<PaymentRecordDto> paymentRecordList = paymentRecordService.getAllPaymentRecord();

        if (!paymentRecordList.isEmpty()){
            return ResponseEntity.status(HttpStatus.OK).body(paymentRecordList);
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }

    @GetMapping("/payment-records/{orderNum}")
    public ResponseEntity<OrderRecordDetailDto> getPaymentRecordDetail(@PathVariable String orderNum){
        OrderRecordDetailDto orderRecordDetailDto = paymentRecordService.getPaymentRecordDetail(orderNum);

        if (orderRecordDetailDto != null){
            return ResponseEntity.status(HttpStatus.OK).body(orderRecordDetailDto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/payment-records/{orderNum}")
    public ResponseEntity<String> createRefund(@PathVariable String orderNum){
        try {
            if (!paymentRecordService.checkRefundQualifications(orderNum)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            boolean onlyUseBonus = paymentRecordService.checkBuyTicketsOnlyUseBonus(orderNum);

            if (onlyUseBonus) {
                // 不須退款，僅退回紅利點數
                paymentRecordService.onlyRefundBonus(orderNum);
            } else {
                // 需要退款，送綠界退款API
                Map<String, String> refundDetail = paymentRecordService.createRefund(orderNum);
                paymentRecordService.handleRefundResponse(refundDetail);
            }

            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            System.out.println(e);

            try {
                boolean onlyUseBonus = paymentRecordService.checkBuyTicketsOnlyUseBonus(orderNum);

                if (!onlyUseBonus) {
                    paymentRecordService.handleNoResponse(orderNum);
                }
            } catch (Exception innerException) {
                System.out.println("Error during handling no response: " + innerException);
            }

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("建立訂單失敗: " + e.getMessage());
        }
    }
}
