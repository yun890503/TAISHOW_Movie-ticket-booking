package com.taishow.controller.cms;

import com.taishow.dto.OrderRecordDetailDto;
import com.taishow.dto.OrderRecordDto;
import com.taishow.service.cms.RefundRecordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RefundRecordController {

    private RefundRecordService refundRecordService;

    public RefundRecordController(RefundRecordService refundRecordService) {
        this.refundRecordService = refundRecordService;
    }

    @GetMapping("/refund-records")
    public ResponseEntity<List<OrderRecordDto>> getAllRefundRecord(){
        List<OrderRecordDto> orderRecordList = refundRecordService.getAllRefundRecord();

        if (!orderRecordList.isEmpty()){
            return ResponseEntity.status(HttpStatus.OK).body(orderRecordList);
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }

    // 退款成功後，關連線會斷掉 (電影票、座位)
    @GetMapping("/refund-records/{orderNum}")
    public ResponseEntity<OrderRecordDetailDto> getRefundRecordDetail(@PathVariable String orderNum){
        OrderRecordDetailDto orderRecordDetailDto = refundRecordService.getRefundRecordDetail(orderNum);

        if (orderRecordDetailDto != null){
            return ResponseEntity.status(HttpStatus.OK).body(orderRecordDetailDto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
