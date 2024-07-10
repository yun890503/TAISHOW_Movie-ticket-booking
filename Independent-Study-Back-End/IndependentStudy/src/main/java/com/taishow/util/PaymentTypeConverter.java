package com.taishow.util;

import java.util.HashMap;
import java.util.Map;

public class PaymentTypeConverter {
    private static final Map<String, String> PAYMENT_TYPE_MAP = new HashMap<>();

    static {
        PAYMENT_TYPE_MAP.put("WebATM_TAISHIN", "台新銀行WebATM");
        PAYMENT_TYPE_MAP.put("WebATM_ESUN", "玉山銀行WebATM");
        PAYMENT_TYPE_MAP.put("WebATM_BOT", "台灣銀行WebATM");
        PAYMENT_TYPE_MAP.put("WebATM_FUBON", "台北富邦WebATM");
        PAYMENT_TYPE_MAP.put("WebATM_CHINATRUST", "中國信託WebATM");
        PAYMENT_TYPE_MAP.put("WebATM_FIRST", "第一銀行WebATM");
        PAYMENT_TYPE_MAP.put("WebATM_CATHAY", "國泰世華WebATM");
        PAYMENT_TYPE_MAP.put("WebATM_MEGA", "兆豐銀行WebATM");
        PAYMENT_TYPE_MAP.put("WebATM_LAND", "土地銀行WebATM");
        PAYMENT_TYPE_MAP.put("WebATM_TACHONG", "大眾銀行WebATM(2018年已併到元大銀行)");
        PAYMENT_TYPE_MAP.put("WebATM_SINOPAC", "永豐銀行WebATM");
        PAYMENT_TYPE_MAP.put("ATM_TAISHIN", "台新銀行ATM");
        PAYMENT_TYPE_MAP.put("ATM_ESUN", "玉山銀行ATM");
        PAYMENT_TYPE_MAP.put("ATM_BOT", "台灣銀行ATM");
        PAYMENT_TYPE_MAP.put("ATM_FUBON", "台北富邦ATM");
        PAYMENT_TYPE_MAP.put("ATM_CHINATRUST", "中國信託ATM");
        PAYMENT_TYPE_MAP.put("ATM_FIRST", "第一銀行ATM");
        PAYMENT_TYPE_MAP.put("ATM_LAND", "土地銀行ATM");
        PAYMENT_TYPE_MAP.put("ATM_CATHAY", "國泰世華銀行ATM");
        PAYMENT_TYPE_MAP.put("ATM_TACHONG", "大眾銀行ATM(2018年已併到元大銀行)");
        PAYMENT_TYPE_MAP.put("ATM_PANHSIN", "板信銀行ATM");
        PAYMENT_TYPE_MAP.put("CVS_CVS", "超商代碼繳款");
        PAYMENT_TYPE_MAP.put("CVS_OK", "OK超商代碼繳款");
        PAYMENT_TYPE_MAP.put("CVS_FAMILY", "全家超商代碼繳款");
        PAYMENT_TYPE_MAP.put("CVS_HILIFE", "萊爾富超商代碼繳款");
        PAYMENT_TYPE_MAP.put("CVS_IBON", "7-11 ibon代碼繳款");
        PAYMENT_TYPE_MAP.put("BARCODE_BARCODE", "超商條碼繳款");
        PAYMENT_TYPE_MAP.put("Credit_CreditCard", "信用卡");
        PAYMENT_TYPE_MAP.put("Flexible_Installment", "圓夢彈性分期");
        PAYMENT_TYPE_MAP.put("TWQR_OPAY", "歐付寶TWQR 行動支付");
        PAYMENT_TYPE_MAP.put("BNPL_URICH", "裕富數位無卡分期");
    }

    public String getProcessedPaymentType(String paymentType) {
        return PAYMENT_TYPE_MAP.getOrDefault(paymentType, "未知的付款方式");
    }
}

