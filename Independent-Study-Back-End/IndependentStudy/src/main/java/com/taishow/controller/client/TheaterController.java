package com.taishow.controller.client;

import com.taishow.entity.Theaters;
import com.taishow.service.client.TheaterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TheaterController {

    private TheaterService theaterService;

    public TheaterController(TheaterService theaterService) {
        this.theaterService = theaterService;
    }

    @PostMapping("/createTheater")
    public ResponseEntity<Theaters> createTheater(@RequestBody Theaters theaters){
        Theaters createdTheater = theaterService.createTheater(theaters);
        if (createdTheater != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTheater);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/theaters")
    public ResponseEntity<List<Theaters>> getAllTheaters(){
        List<Theaters> theatersList = theaterService.getAllTheaters();

        if (!theatersList.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(theatersList);
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }

    @GetMapping("/theaters/{theaterId}")
    public ResponseEntity<Theaters> getTheater(@PathVariable Integer theaterId){
        Theaters theater = theaterService.getTheater(theaterId);

        if (theater != null) {
            return ResponseEntity.status(HttpStatus.OK).body(theater);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/theaters/{theaterId}")
    public ResponseEntity<Theaters> updateTheater(@PathVariable Integer theaterId,
                                                  @RequestBody Theaters theaters){
        Theaters existingTheater = theaterService.getTheater(theaterId);

        if (existingTheater == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        theaterService.updateTheater(theaterId, theaters);

        Theaters updatedTheater = theaterService.getTheater(theaterId);

        return ResponseEntity.status(HttpStatus.OK).body(updatedTheater);
    }

    @DeleteMapping("/theaters/{theaterId}")
    public ResponseEntity<Theaters> deleteTheater(@PathVariable Integer theaterId){
        theaterService.deleteTheater(theaterId);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
