package com.taishow.controller.cms;

import com.taishow.service.cms.StillService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.IIOException;
import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/still")
public class StillController {
    StillService stillService;

    public StillController(StillService stillService) {
        this.stillService = stillService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadStills(@RequestParam("files")List<MultipartFile> files,
                                       @RequestParam("movieId") Integer movieId) {
        try {
            List<String> stills = files.stream().map(file -> {
                        try {
                            return Base64.getEncoder().encodeToString(file.getBytes()); // 必須有IO例外儲儷
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .collect(Collectors.toList());
            stillService.insertStills(stills, movieId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }

}
