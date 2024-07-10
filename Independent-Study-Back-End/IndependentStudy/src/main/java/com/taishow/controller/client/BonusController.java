package com.taishow.controller.client;

import com.taishow.dto.BonusDetailDto;
import com.taishow.service.client.BonusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bonus")
public class BonusController {

    @Autowired
    private BonusService bonusService;

    @GetMapping("/BonusPoints")
    public List<BonusDetailDto> getBonusPointDetails(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return bonusService.getBonusByToken(token);
    }
}