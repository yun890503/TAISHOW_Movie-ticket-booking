package com.taishow.dao;

import com.taishow.entity.Tickets;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Tickets, Integer> {
    public List<Tickets> findByOrdersId(Integer ordersId);
}
