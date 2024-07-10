package com.taishow.dto;

public class OrderRecordDto {

    private String orderNum;
    private String account;
    private Integer totalAmount;
    private Integer bonus;
    private String payway;
    private String payStatus;

    public OrderRecordDto(String orderNum, String account, Integer totalAmount, Integer bonus, String payway, String payStatus) {
        this.orderNum = orderNum;
        this.account = account;
        this.totalAmount = totalAmount;
        this.bonus = bonus;
        this.payway = payway;
        this.payStatus = payStatus;
    }

    public String getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(String orderNum) {
        this.orderNum = orderNum;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public Integer getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Integer totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Integer getBonus() {
        return bonus;
    }

    public void setBonus(Integer bonus) {
        this.bonus = bonus;
    }

    public String getPayway() {
        return payway;
    }

    public void setPayway(String payway) {
        this.payway = payway;
    }

    public String getPayStatus() {
        return payStatus;
    }

    public void setPayStatus(String payStatus) {
        this.payStatus = payStatus;
    }
}
