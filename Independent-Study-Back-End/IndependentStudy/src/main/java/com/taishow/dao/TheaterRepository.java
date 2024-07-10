package com.taishow.dao;

import com.taishow.entity.Theaters;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TheaterRepository extends JpaRepository<Theaters, Integer> {
}
