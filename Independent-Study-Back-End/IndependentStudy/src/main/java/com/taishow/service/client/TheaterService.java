package com.taishow.service.client;

import com.taishow.dao.TheaterRepository;
import com.taishow.entity.Theaters;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TheaterService {

    private TheaterRepository theaterRepository;

    public TheaterService(TheaterRepository theaterRepository) {
        this.theaterRepository = theaterRepository;
    }

    public Theaters createTheater(Theaters theaters){
        return theaterRepository.save(theaters);
    }

    public List<Theaters> getAllTheaters(){
        return theaterRepository.findAll();
    }

    public Theaters getTheater(Integer theaterId){
        Optional<Theaters> theaterOptional = theaterRepository.findById(theaterId);
        return theaterOptional.orElse(null);
    }

    public void updateTheater(Integer theaterId, Theaters theaters){
        Theaters existingTheater = getTheater(theaterId);

        if (existingTheater != null) {
            existingTheater.setTheaterName(theaters.getTheaterName());
            existingTheater.setArea(theaters.getArea());
            existingTheater.setAddress(theaters.getAddress());
            existingTheater.setTel(theaters.getTel());
            existingTheater.setImage(theaters.getImage());
            theaterRepository.save(existingTheater);
        }
    }

    public void deleteTheater(Integer theaterId){
        theaterRepository.deleteById(theaterId);
    }
}
