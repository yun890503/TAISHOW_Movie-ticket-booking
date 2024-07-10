package com.taishow.service.cms;

import com.taishow.dao.StillDao;
import com.taishow.entity.Stills;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StillService {
    StillDao stillDao;

    public StillService(StillDao stillDao) {
        this.stillDao = stillDao;
    }

    public void insertStills(List<String> stills, Integer movieId) {
        for (String still : stills){
            Stills newStill = new Stills();
            newStill.setStills(still);
            newStill.setMovieId(movieId);
            stillDao.save(newStill);
        }
    }

}
