package com.taishow.service.cms;

import com.taishow.dao.*;
import com.taishow.dto.OrderRecordDetailDto;
import com.taishow.dto.OrderRecordDto;
import com.taishow.dto.PaymentRecordDto;
import com.taishow.dto.TicketDetailDto;
import com.taishow.entity.*;
import com.taishow.util.RefundCalculationResult;
import ecpay.payment.integration.AllInOne;
import ecpay.payment.integration.domain.DoActionObj;
import jakarta.transaction.Transactional;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PaymentRecordService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final BonusRepository bonusRepository;
    private final TicketRepository ticketRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final SeatStatusRepository seatStatusRepository;
    private final SeatRepository seatRepository;
    private final ShowTimeRepository showTimeRepository;
    private final MovieRepository movieRepository;

    public PaymentRecordService(UserRepository userRepository, OrderRepository orderRepository,
                                PaymentRepository paymentRepository, BonusRepository bonusRepository,
                                TicketRepository ticketRepository, TicketTypeRepository ticketTypeRepository,
                                SeatStatusRepository seatStatusRepository, SeatRepository seatRepository,
                                ShowTimeRepository showTimeRepository, MovieRepository movieRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.bonusRepository = bonusRepository;
        this.ticketRepository = ticketRepository;
        this.ticketTypeRepository = ticketTypeRepository;
        this.seatStatusRepository = seatStatusRepository;
        this.seatRepository = seatRepository;
        this.showTimeRepository = showTimeRepository;
        this.movieRepository = movieRepository;
    }

    public List<PaymentRecordDto> getAllPaymentRecord(){
        List<Object[]> results = orderRepository.getAllOrderRecordAndShowTimeByMethod("付款");
        return results.stream().map(this::convertToPaymentRecordDto).collect(Collectors.toList());
    }

    private PaymentRecordDto convertToPaymentRecordDto(Object[] record) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return new PaymentRecordDto(
                (String) record[0],  // orderNum
                (String) record[1],  // account
                (Integer) record[2], // totalAmount
                Math.toIntExact((Long) record[3]), // bonus
                (String) record[4],  // payway
                (String) record[5],  // payStatus
                dateFormat.format((Timestamp) record[6]),   // showTime
                (Boolean) record[7] // isRefunded
        );
    }

    public OrderRecordDetailDto getPaymentRecordDetail(String orderNum){
        List<Object[]> results = orderRepository.getOrderRecordDetailByOrderNumAndMethod(orderNum, "付款");

        if (results.isEmpty()) {
            return null;
        }

        OrderRecordDetailDto orderRecordDetailDto = new OrderRecordDetailDto();
        List<TicketDetailDto> ticketDetailList = new ArrayList<>();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        for (Object[] result : results) {
            if (orderRecordDetailDto.getOrderNum() == null) {
                orderRecordDetailDto.setOrderNum((String) result[0]);
                orderRecordDetailDto.setOrderDate(dateFormat.format((Timestamp) result[1]));
                orderRecordDetailDto.setAccount((String) result[2]);
                orderRecordDetailDto.setTotalAmount((Integer) result[3]);
                orderRecordDetailDto.setBonus(Math.toIntExact((Long) result[4]));
                orderRecordDetailDto.setQrcode((String) result[5]);
                orderRecordDetailDto.setTitle((String) result[6]);
                orderRecordDetailDto.setShowTime(dateFormat.format((Timestamp) result[7]));
                orderRecordDetailDto.setPayway((String) result[12]);
                orderRecordDetailDto.setPayStatus((String) result[13]);
                orderRecordDetailDto.setPayTime(result[14] != null ? dateFormat.format((Timestamp) result[14]) : null);
                orderRecordDetailDto.setModifyTime(dateFormat.format((Timestamp) result[15]));
            }

            TicketDetailDto ticketDetailDto = new TicketDetailDto();
            ticketDetailDto.setTicketType((String) result[8]);
            ticketDetailDto.setRowNum((Integer) result[9]);
            ticketDetailDto.setSeatNum((Integer) result[10]);
            ticketDetailDto.setUnitPrice((Integer) result[11]);

            ticketDetailList.add(ticketDetailDto);
        }

        orderRecordDetailDto.setTicketDetailList(ticketDetailList);

        return orderRecordDetailDto;
    }

    // 檢查退款資格
    public boolean checkRefundQualifications(String orderNum) {
        Payment payment = paymentRepository.getPaymentByOrderNum(orderNum)
                .orElseThrow(() -> new RuntimeException("付款紀錄不存在"));

        Optional<Date> optionalShowTime = orderRepository.getShowTimeByOrderNum(orderNum);

        if (!optionalShowTime.isPresent()) {
            throw new RuntimeException("場次不存在");
        }

        LocalDateTime showTimeLocalDateTime = optionalShowTime.get().toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
        LocalDateTime deadLine = showTimeLocalDateTime.minusMinutes(30);

        LocalDateTime now = LocalDateTime.now();

        return (payment.getPayStatus().equals("完成") || payment.getPayStatus().equals("不需付款")) && now.isBefore(deadLine);
    }

    public boolean checkBuyTicketsOnlyUseBonus(String orderNum) {
        Orders orders = orderRepository.findByOrderNum(orderNum)
                .orElseThrow(() -> new RuntimeException("訂單不存在"));

        // 檢查是不是僅用紅利購票
        return orders.getTotalAmount().equals(0);
    }


    @Transactional
    public void onlyRefundBonus(String orderNum) {
        Payment payment = paymentRepository.getPaymentByOrderNum(orderNum)
                .orElseThrow(() -> new RuntimeException("付款紀錄不存在"));

        List<Bonus> bonusList = bonusRepository.findByPaymentId(payment.getId());
        if (bonusList.isEmpty()) {
            throw new RuntimeException("紅利單號不存在");
        }

        // 建立退款紀錄
        Payment refund = new Payment();
        Date now = new Date();

        refund.setOrdersId(payment.getOrdersId());
        refund.setPayway("");
        refund.setPayStatus("已退款");
        refund.setPayTime(now);
        refund.setMethod("退款");
        refund.setModifyTime(now);
        paymentRepository.save(refund);

        // 退回紅利點數
        Bonus bonus = new Bonus();
        bonus.setPaymentId(refund.getId());
        bonus.setBonus(bonusList.get(0).getBonus() * -1);
        bonus.setModifyTime(now);
        bonusRepository.save(bonus);
    }


    //建立退款單
    public Map<String, String> createRefund(String orderNum){
        Orders orders = orderRepository.findByOrderNum(orderNum)
                .orElseThrow(() -> new RuntimeException("訂單不存在"));
        Payment payment = paymentRepository.getPaymentByOrderNum(orderNum)
                .orElseThrow(() -> new RuntimeException("付款紀錄不存在"));

        // 計算退款詳細資訊
        RefundCalculationResult calculationResult = calculateRefundDetails(orders, payment);
        boolean isReturnBonus = calculationResult.isReturnBonus();
        int bonusEquivalentAmount = calculationResult.getBonusEquivalentAmount();

        //建立退款紀錄
        try {
            Payment refund = new Payment();
            Date now = new Date();

            refund.setOrdersId(orders.getId());
            refund.setPayway("");
            refund.setPayStatus("退款中");
            refund.setMethod("退款");
            refund.setModifyTime(now);
            paymentRepository.save(refund);
        } catch (Exception e){
            System.out.println(e);
            throw e;
        }

        AllInOne allInOne = new AllInOne("");
        DoActionObj doActionObj = new DoActionObj();

        doActionObj.setMerchantID("3002607");
        doActionObj.setMerchantTradeNo(orders.getOrderNum());
        doActionObj.setTradeNo(payment.getTradeNum());
        doActionObj.setAction("R");
        doActionObj.setTotalAmount(isReturnBonus ? orders.getTotalAmount().toString() :
                String.valueOf(orders.getTotalAmount() + bonusEquivalentAmount));
        doActionObj.setPlatformID("");

        String response = allInOne.doAction(doActionObj);
        System.out.println("Response from doAction: " + response);

        // 返回訂單詳情
        Map<String, String> refundDetail = new HashMap<>();
        refundDetail.put("response", response);
        refundDetail.put("isReturnBonus", String.valueOf(isReturnBonus));

        return refundDetail;
    }


    //*****POST給綠界退款請求，直接接收回調參數，異動資料庫*****
    @Transactional
    public void handleRefundResponse(Map<String, String> refundDetail) {
        // 解析response
        Map<String, String> responseMap = parseQueryString(refundDetail.get("response"));
        String merchantTradeNo = responseMap.get("MerchantTradeNo");
        String rtnCode = responseMap.get("RtnCode");
        String tradeNo = responseMap.get("TradeNo");
        boolean isReturnBonus = Boolean.parseBoolean(refundDetail.get("isReturnBonus"));

        Orders orders = orderRepository.findByOrderNum(merchantTradeNo)
                .orElseThrow(() -> new RuntimeException("訂單不存在"));
        Payment refund = paymentRepository.getPaymentByOrderNumAndMethod(merchantTradeNo, "退款")
                .orElseThrow(() -> new RuntimeException("退款紀錄不存在"));
        Date now = new Date();

        refund.setPayway("信用卡");
        refund.setPayStatus("1".equals(rtnCode) ? "已退款" : "退款失敗");
        refund.setPayTime("1".equals(rtnCode) ? now : null);
        refund.setModifyTime(now);
        refund.setTradeNum(tradeNo);
        paymentRepository.save(refund);

        // 綠界回傳退款成功，才執行以下動作
        if ("1".equals(rtnCode)){
            // 退回紅利點數
            if (isReturnBonus) {
                List<Bonus> bonusList = bonusRepository.getBonusByOrderNumAndMethod(merchantTradeNo, "付款");

                if (bonusList.isEmpty()) {
                    throw new RuntimeException("紅利紀錄不存在");
                }

                for (Bonus bonus : bonusList) {
                    Bonus returnBonus = new Bonus();
                    returnBonus.setPaymentId(refund.getId());
                    returnBonus.setBonus(bonus.getBonus() * -1);
                    returnBonus.setModifyTime(now);
                    bonusRepository.save(returnBonus);
                }
            }

            // 更新座位狀態
            List<Tickets> ticketsList = ticketRepository.findByOrdersId(orders.getId());
            if (ticketsList.isEmpty()) {
                throw new RuntimeException("電影票不存在");
            }

            for (Tickets ticket : ticketsList) {
                SeatStatus seatStatus = seatStatusRepository.findById(ticket.getSeatStatusId())
                        .orElseThrow(() -> new RuntimeException("座位不存在"));

                seatStatus.setStatus("available");
                seatStatusRepository.save(seatStatus);
            }
        }
    }

    // 送綠界失敗，修改訂單資訊
    public void handleNoResponse(String orderNum){
        Payment refund = paymentRepository.getPaymentByOrderNumAndMethod(orderNum, "退款")
                .orElseThrow(() -> new RuntimeException("退款紀錄不存在"));
        Date now = new Date();

        refund.setPayStatus("退款失敗");
        refund.setModifyTime(now);
        paymentRepository.save(refund);
    }

    // 計算退款詳細資訊
    private RefundCalculationResult calculateRefundDetails(Orders orders, Payment payment) {
        User user = userRepository.findById(orders.getUserId())
                .orElseThrow(() -> new RuntimeException("會員不存在"));
        List<Bonus> bonusList = bonusRepository.findByPaymentId(payment.getId());

        if (bonusList.isEmpty()) {
            throw new RuntimeException("紅利紀錄不存在");
        }

        //計算退款後，會員總紅利點數 (在此先取得會員身上紅利點數)
        int estimatedBonusAfterReturn = user.getBonusPoint();

        //紅利點數等值金額 (會員將紅利點數使用掉，導致返還會變成負數)
        int bonusEquivalentAmount = 0;

        //會員當前紅利 + 紅利點數購票 + 購票產生紅利
        //計算退款後，因此"紅利點數購票、購票產生紅利" * -1
        for (Bonus bonus : bonusList) {
            estimatedBonusAfterReturn -= bonus.getBonus();
            bonusEquivalentAmount -= bonus.getBonus();
        }

        //是否需要返還紅利點數
        boolean isReturnBonus = estimatedBonusAfterReturn >= 0;
        return new RefundCalculationResult(isReturnBonus, bonusEquivalentAmount);
    }

    // 處理綠界回傳金流格式
    private Map<String, String> parseQueryString(String queryString) {
        Map<String, String> queryMap = new HashMap<>();
        String[] pairs = queryString.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            String key = URLDecoder.decode(pair.substring(0, idx), StandardCharsets.UTF_8);
            String value = URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8);
            queryMap.put(key, value);
        }
        return queryMap;
    }
}
