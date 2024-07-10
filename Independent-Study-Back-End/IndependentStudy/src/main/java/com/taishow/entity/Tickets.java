package com.taishow.entity;

import jakarta.persistence.*;

@Entity
public class Tickets {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ticket_type_id")
    private Integer ticketTypeId;

    @Column(name = "seat_status_id")
    private Integer seatStatusId;

    @Column(name = "orders_id")
    private Integer ordersId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getTicketTypeId() {
        return ticketTypeId;
    }

    public void setTicketTypeId(Integer ticketTypeId) {
        this.ticketTypeId = ticketTypeId;
    }

    public Integer getSeatStatusId() {
        return seatStatusId;
    }

    public void setSeatStatusId(Integer seatStatusId) {
        this.seatStatusId = seatStatusId;
    }

    public Integer getOrdersId() {
        return ordersId;
    }

    public void setOrdersId(Integer ordersId) {
        this.ordersId = ordersId;
    }
}
