package com.taishow.controller.cms;

import com.taishow.dto.OrderRecordDto;
import com.taishow.service.cms.BonusRecordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BonusRecordController {

    private BonusRecordService bonusRecordService;

    public BonusRecordController(BonusRecordService bonusRecordService) {
        this.bonusRecordService = bonusRecordService;
    }

    @GetMapping("/bonus-records")
    public ResponseEntity<List<OrderRecordDto>> getAllBonusRecord(){
        List<OrderRecordDto> orderRecordList = bonusRecordService.getAllBonusRecord();

        if (!orderRecordList.isEmpty()){
            return ResponseEntity.status(HttpStatus.OK).body(orderRecordList);
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }
}
