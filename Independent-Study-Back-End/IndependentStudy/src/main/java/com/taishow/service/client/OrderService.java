package com.taishow.service.client;

import com.taishow.dao.*;
import com.taishow.dto.OrderDto;
import com.taishow.entity.*;
import com.taishow.util.PaymentTypeConverter;
import com.taishow.util.QRCodeGenerator;
import com.taishow.util.Snowflake;
import ecpay.payment.integration.AllInOne;
import ecpay.payment.integration.domain.AioCheckOutALL;
import ecpay.payment.integration.domain.DoActionObj;
import jakarta.transaction.Transactional;
import org.json.JSONObject;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final BonusRepository bonusRepository;
    private final TicketRepository ticketRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final SeatStatusRepository seatStatusRepository;
    private final TheaterRepository theaterRepository;
    private final ShowTimeRepository showTimeRepository;
    private final Snowflake snowflake;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository,
                        PaymentRepository paymentRepository, BonusRepository bonusRepository,
                        TicketRepository ticketRepository, TicketTypeRepository ticketTypeRepository,
                        SeatStatusRepository seatStatusRepository, TheaterRepository theaterRepository,
                        ShowTimeRepository showTimeRepository, Snowflake snowflake) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.bonusRepository = bonusRepository;
        this.ticketRepository = ticketRepository;
        this.ticketTypeRepository = ticketTypeRepository;
        this.seatStatusRepository = seatStatusRepository;
        this.theaterRepository = theaterRepository;
        this.showTimeRepository = showTimeRepository;
        this.snowflake = snowflake;
    }

    public List<TicketType> getTicketTypeDetail(Integer movieId){
        return ticketTypeRepository.findAll();
    }

    public void checkOrderInformation(OrderDto orderDto, Integer movieId){
        // 檢查有無選擇影城、場次
        if (orderDto.getTheaterId() == null || orderDto.getShowTimeId() == null){
            throw new IllegalArgumentException("請先選擇場次");
        }

        // 檢查票數是否為0張、大於6張
        if (orderDto.getSeatStatusId().isEmpty()) {
            throw new IllegalArgumentException("請先選擇座位");
        } else if (orderDto.getSeatStatusId().size() > 6) {
            throw new IllegalArgumentException("最多僅能購買六張票");
        }

        // 檢查票數跟票種是否相同
        if (orderDto.getSeatStatusId().size() != orderDto.getTicketTypeId().size()) {
            throw new IllegalArgumentException("請選擇等同座位數的票");
        }

        // 檢查影城、場次是否存在
        Optional<Theaters> theatersOptional = theaterRepository.findById(orderDto.getTheaterId());
        Optional<ShowTime> showTimeOptional = showTimeRepository.findById(orderDto.getShowTimeId());
        if (theatersOptional.isEmpty() || showTimeOptional.isEmpty()){
            throw new RuntimeException("場次不存在，請重新選擇場次");
        }

        // 檢查座位是否存在 && ( 檢查座位是否沒有payStatus資料 || 檢查座位最新一筆payStatus是否為"已退款" || "付款失敗" || "已取消" )
        for (Integer seatStatusId : orderDto.getSeatStatusId()) {
            SeatStatus seatStatus = seatStatusRepository.findById(seatStatusId)
                    .orElseThrow(() -> new IllegalArgumentException("座位不存在，請重新選擇"));

            List<String> payStatusList = seatStatusRepository.getPayStatusById(seatStatusId);
            if (!payStatusList.isEmpty()) {
                String latestPayStatus = payStatusList.get(0);
                if (!"已退款".equals(latestPayStatus) && !"付款失敗".equals(latestPayStatus) && !"已取消".equals(latestPayStatus)) {
                    throw new IllegalArgumentException("座位已有人預訂，請重新選擇座位");
                }
            }
        }
    }

    @Transactional
    public Map<String, String> createOrder(OrderDto orderDto, Integer movieId, Integer userId) {
        // 計算總金額和總扣除紅利
        int totalPrice = 0;
        int reduceBonusPoint = 0;

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("錯誤的會員資訊，請刷新頁面再試"));

        //計算會員持有的紅利點數
        Integer userBonusPoint = userRepository.findTotalBonusByUserId(userId);

        for (int i = 0; i < orderDto.getSeatStatusId().size(); i++) {
            TicketType ticketType = ticketTypeRepository.findById(orderDto.getTicketTypeId().get(i))
                    .orElseThrow(() -> new RuntimeException("無效的票種"));

            if ("紅利點數".equals(ticketType.getTicketType())) {
                // 紅利點數兌票需要250點
                final int requiredBonusPoints = 250;
                if (userBonusPoint >= requiredBonusPoints) {
                    userBonusPoint -= requiredBonusPoints;
                    reduceBonusPoint -= requiredBonusPoints;
                } else {
                    throw new RuntimeException("紅利點數不足");
                }
            } else {
                // 酌收10%手續費
                totalPrice += (int) (ticketType.getUnitPrice() * 1.1);
            }
        }

        // 取得現在時間
        Date now = new Date();

        // 建立訂單
        Orders orders = new Orders();
        orders.setUserId(userId);
        orders.setOrderNum(String.valueOf(snowflake.nextId()));
        orders.setOrderDate(now);
        orders.setTotalAmount(totalPrice);
        try {
            String qrCodeBase64 = QRCodeGenerator.generateQRCodeBase64(orders.getOrderNum(), 350, 350);
            orders.setQrcode("data:image/png;base64," + qrCodeBase64);
        } catch (Exception e) {
            System.out.println("生成QR碼失敗: " + e.getMessage());
        }
        orderRepository.save(orders);

        // 建立支付紀錄
        Payment payment = new Payment();
        payment.setOrdersId(orders.getId());
        payment.setPayway("");
        payment.setPayStatus(orders.getTotalAmount() != 0 ? "未付款" : "不需付款");
        payment.setMethod("付款");
        payment.setModifyTime(now);
        paymentRepository.save(payment);

        // 若使用紅利點數兌票，於此扣除紅利
        if (reduceBonusPoint < 0) {
            Bonus bonus = new Bonus();
            bonus.setPaymentId(payment.getId());
            bonus.setBonus(reduceBonusPoint);
            bonus.setModifyTime(now);
            bonusRepository.save(bonus);
        }

        // 更新會員紅利點數
        Integer updateUserBonusPoint = userRepository.findTotalBonusByUserId(userId);
        user.setBonusPoint(updateUserBonusPoint);
        userRepository.save(user);

        // 建立電影票
        for (int i = 0; i < orderDto.getSeatStatusId().size(); i++) {
            Tickets tickets = new Tickets();
            tickets.setTicketTypeId(orderDto.getTicketTypeId().get(i));
            tickets.setSeatStatusId(orderDto.getSeatStatusId().get(i));
            tickets.setOrdersId(orders.getId());
            ticketRepository.save(tickets);
        }

        // 返回訂單詳情
        Map<String, String> orderDetail = new HashMap<>();
        orderDetail.put("totalPrice", String.valueOf(totalPrice));
        orderDetail.put("theaterId", orderDto.getTheaterId().toString());
        orderDetail.put("OrderNum", orders.getOrderNum());

        return orderDetail;
    }

    public String ecpayCheckout(Map<String, String> orderDetail) {
        AllInOne allInOne = new AllInOne("");
        AioCheckOutALL obj = new AioCheckOutALL();

        Date now = new Date();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        String formattedDate = simpleDateFormat.format(now);

        obj.setMerchantID("3002607");
        obj.setMerchantTradeNo(orderDetail.get("OrderNum"));
        obj.setMerchantTradeDate(formattedDate);
        obj.setTotalAmount(orderDetail.get("totalPrice"));
        obj.setTradeDesc("電影訂票");
        obj.setItemName("電影票");
        obj.setReturnURL("http://localhost:8080/ecpayCallback"); //付款完成通知回傳網址
        obj.setStoreID(orderDetail.get("theaterId")); //特店旗下店舖代號 (theaterId)
        obj.setClientBackURL("https://www.youtube.com/"); //Client端返回特店的按鈕連結
        obj.setOrderResultURL("http://localhost:8080/ecpayCallback"); //Client端回傳付款結果網址，測試完成再改用這個
        obj.setNeedExtraPaidInfo("N");

        String form = allInOne.aioCheckOut(obj, null);

        //將表單存回資料庫
        Optional<Payment> paymentOptional = paymentRepository.getPaymentByOrderNum(orderDetail.get("OrderNum"));
        if (paymentOptional.isEmpty()){
            throw new RuntimeException("訂單不存在");
        }

        Payment payment = paymentOptional.get();

        payment.setPaymentForm(form);
        payment.setModifyTime(now);
        paymentRepository.save(payment);

        return form;
    }

    @Transactional
    public void paymentSuccess(Hashtable<String, String> callbackData) {
        String orderNum = callbackData.get("MerchantTradeNo");

        Optional<Orders> ordersOptional = orderRepository.findByOrderNum(orderNum);
        if (ordersOptional.isEmpty()) {
            throw new RuntimeException("訂單不存在");
        }

        Orders orders = ordersOptional.get();
        Optional<Payment> paymentOptional = paymentRepository.findByOrdersId(orders.getId());

        if (paymentOptional.isEmpty()) {
            throw new RuntimeException("付款紀錄不存在");
        }

        Payment payment = paymentOptional.get();
        Date now = new Date();
        PaymentTypeConverter paymentTypeConverter = new PaymentTypeConverter();
        String paymentType = callbackData.get("PaymentType");
        String processedPaymentType = paymentTypeConverter.getProcessedPaymentType(paymentType);

        payment.setPayway(processedPaymentType);
        payment.setPayStatus("完成");
        payment.setPayTime(now);
        payment.setModifyTime(now);
        payment.setTradeNum(callbackData.get("TradeNo"));
        payment.setPaymentForm(null);
        paymentRepository.save(payment);

        // 訂單成功，產生紅利
        Bonus bonus = new Bonus();
        bonus.setPaymentId(payment.getId());
        bonus.setBonus((int) (orders.getTotalAmount() * 0.1));
        bonus.setModifyTime(now);
        bonusRepository.save(bonus);
    }

    @Transactional
    public void paymentFailure(Hashtable<String, String> callbackData) {
        String orderNum = callbackData.get("MerchantTradeNo");

        Orders orders = orderRepository.findByOrderNum(orderNum)
                .orElseThrow(() -> new RuntimeException("訂單不存在"));

        Payment payment = paymentRepository.findByOrdersId(orders.getId())
                .orElseThrow(() -> new RuntimeException("付款紀錄不存在"));

        Date now = new Date();
        PaymentTypeConverter paymentTypeConverter = new PaymentTypeConverter();
        String paymentType = callbackData.get("PaymentType");
        String processedPaymentType = paymentTypeConverter.getProcessedPaymentType(paymentType);

        // 更新付款紀錄
        payment.setPayway(processedPaymentType);
        payment.setPayStatus("付款失敗");
        payment.setModifyTime(now);
        payment.setTradeNum(callbackData.get("TradeNo"));
        payment.setPaymentForm(null);
        paymentRepository.save(payment);

        // 紅利購票時，退回紅利點數
        List<Bonus> bonusList = bonusRepository.findByPaymentId(payment.getId());
        if (!bonusList.isEmpty()) {
            Bonus bonusRecord = bonusList.get(0);

            // 將扣除的bonus變回正數
            Integer revertBonus = Math.abs(bonusRecord.getBonus());

            // 寫入一筆退回的紀錄
            Bonus bonus = new Bonus();
            bonus.setPaymentId(payment.getId());
            bonus.setBonus(revertBonus);
            bonus.setModifyTime(now);
            bonusRepository.save(bonus);
        } else {
            System.out.println("該筆訂單未使用紅利點數購票");
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

    public boolean isOrderCancel(Hashtable<String, String> callbackData){
        String orderNum = callbackData.get("MerchantTradeNo");
        Payment payment = paymentRepository.getPaymentByOrderNum(orderNum)
                .orElseThrow(() -> new RuntimeException("付款紀錄不存在"));

        return "已取消".equals(payment.getPayStatus());
    }

    public void checkAndCancelOrders() {
//        System.out.println("執行checkAndCancelOrders()");
        List<Object[]> results = orderRepository.findPendingOrders();
//        System.out.println("results: " + results);
        LocalDateTime now = LocalDateTime.now();
//        System.out.println("now: " +now);

        for (Object[] result : results) {
            try {
//                System.out.println("進入result迴圈");
                String orderNum = (String) result[0];
//                System.out.println("orderNum: " + orderNum);
                LocalDateTime showTime = convertToLocalDateTime(result[1]);
//                System.out.println("showTime: " + showTime);

                Orders order = orderRepository.findByOrderNum(orderNum)
                        .orElseThrow(() -> new RuntimeException("訂單不存在"));

                LocalDateTime orderDate = convertToLocalDateTime(order.getOrderDate());
//                System.out.println("orderDate: "+orderDate);

                if (orderDate.plusMinutes(30).isBefore(now) || now.isAfter(showTime)) {
//                    System.out.println("檢查結果1: "+orderDate.plusMinutes(30).isBefore(now));
//                    System.out.println("檢查結果2: "+now.isAfter(showTime));
                    Payment payment = paymentRepository.findByOrdersId(order.getId())
                            .orElseThrow(() -> new RuntimeException("付款紀錄不存在"));

                    Date modifyTime = new Date();
//                    System.out.println("modifyTime: "+modifyTime);

                    // 更新付款紀錄
                    payment.setPayStatus("已取消");
                    payment.setModifyTime(modifyTime);
                    payment.setPaymentForm(null);
                    paymentRepository.save(payment);

                    // 紅利購票時，退回紅利點數
                    List<Bonus> bonusList = bonusRepository.findByPaymentId(payment.getId());
                    if (!bonusList.isEmpty()) {
                        Bonus bonusRecord = bonusList.get(0);

                        // 將扣除的bonus變回正數
                        Integer revertBonus = Math.abs(bonusRecord.getBonus());

                        // 寫入一筆退回的紀錄
                        Bonus bonus = new Bonus();
                        bonus.setPaymentId(payment.getId());
                        bonus.setBonus(revertBonus);
                        bonus.setModifyTime(modifyTime);
                        bonusRepository.save(bonus);
                    } else {
                        System.out.println("該筆訂單未使用紅利點數購票");
                    }

                    // 更新座位狀態
                    List<Tickets> ticketsList = ticketRepository.findByOrdersId(order.getId());
                    if (ticketsList.isEmpty()) {
                        throw new RuntimeException("電影票不存在");
                    }

                    for (Tickets ticket : ticketsList) {
                        SeatStatus seatStatus = seatStatusRepository.findById(ticket.getSeatStatusId())
                                .orElseThrow(() -> new RuntimeException("座位不存在"));

                        seatStatus.setStatus("available");
                        seatStatusRepository.save(seatStatus);
                    }
//                    System.out.println("結束checkAndCancelOrders()");
                }
            } catch (Exception e) {
                System.out.println("尋訪訂單失敗: " + e.getMessage());
            }
        }
    }

    private LocalDateTime convertToLocalDateTime(Object timestamp) {
        if (timestamp instanceof Timestamp) {
            return ((Timestamp) timestamp).toLocalDateTime();
        } else if (timestamp instanceof Date) {
            return new Timestamp(((Date) timestamp).getTime()).toLocalDateTime();
        } else {
            throw new IllegalArgumentException("Unsupported timestamp type: " + timestamp.getClass().getName());
        }
    }

    private LocalDateTime convertToLocalDateTime(Date date) {
        return date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }
}
