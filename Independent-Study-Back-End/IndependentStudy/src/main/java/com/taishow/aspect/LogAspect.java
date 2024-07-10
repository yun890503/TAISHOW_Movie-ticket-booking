package com.taishow.aspect;

import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Arrays;

// AOP: 日誌log()
@Aspect
@Component
public class LogAspect {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    // controller檔案下所有的controller及所有方法 => (..)可以任何參數、可以任意返回
    // 定義切面位置
    @Pointcut("within(com.taishow.controller.cms.LoginController) || " +
            "within(com.taishow.controller.cms.MovieReleaseController) || " +
            "within(com.taishow.controller.cms.StillController)")
    public void log(){
    }

    // 調用所有方法之前，紀錄請求
    // 切入點給定的對象：類+方法
    @Before("log()")
    public void doBefore(JoinPoint joinPoint){
        // Http request
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();

        String classMethod = joinPoint.getSignature().getDeclaringTypeName() + "." + joinPoint.getSignature().getName();
        RequestLog requestLog = new RequestLog(
                request.getRequestURL().toString(), // String類型
                request.getRemoteAddr(), // 紀錄IP位址
                classMethod, // 類別名稱及方法名字
                joinPoint.getArgs() // 獲取所有請求參數
        );
        logger.info("日誌記錄 AOP 請求內容: ----- {}", requestLog);
    }

    @After("log()")
    public void doAfter(){
        logger.info("------------------- 日誌記錄 AOP 結束 ---------------------");
    }

    // 被攔截的切面執行事件完 => 返回調用方法內容 => Object result 接受 ResponseEntity
    // 需先判斷API的請求方是否已驗證，若無驗證則無法取得請求方的資訊
    @AfterReturning(returning = "result", pointcut = "log()")
    public void doAfterReturning(Object result){
        logger.info("日誌記錄 AOP Return: ----- {}", result);
    }

    // 紀錄請求內容的類別
    private static class RequestLog{
        final String url;
        final private String ip;
        final private String classMethod;
        final private Object[] args; // 請求參數 => 多種類型

        public RequestLog(String url, String ip, String classMethod, Object[] args) {
            this.url = url;
            this.ip = ip;
            this.classMethod = classMethod;
            this.args = args;
        }

        // 輸出在日誌 => 給予toSting()方法
        @Override
        public String toString() {
            return "RequestLog{" +
                    "url='" + url + '\'' +
                    ", ip='" + ip + '\'' +
                    ", classMethod='" + classMethod + '\'' +
                    ", args=" + Arrays.toString(args) +
                    '}';
        }
    }
}
