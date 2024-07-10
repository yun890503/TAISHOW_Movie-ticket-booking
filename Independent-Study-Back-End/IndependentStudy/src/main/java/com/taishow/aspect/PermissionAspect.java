package com.taishow.aspect;

import com.alibaba.fastjson.JSON;
import com.taishow.entity.User;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

// AOP: 權限驗證
@Aspect
@Component
public class PermissionAspect {

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    // 定義切面，加入自定義註解的路徑
    // 被 Pointcut 匹配到的方法，他們所屬的類別會被 Spring 動態代理(dynamic proxy)
    // 產生元件的代理類別+將 Advice 內容帶入=> 元件(bean) 原類別＋Advice=代理類別
    @Pointcut("@annotation(com.taishow.annotation.PermissionAnnotation)")
    private void permissionLogin() {
    }

    // 可實作同時涵蓋法訪執行前後的 Advice，方法參數包含: ProceedingJoinPoint
    // 需要呼叫 proceed 方法，才會開始執行原方法
    @Around("permissionLogin()")
    public Object CheckFirst(ProceedingJoinPoint joinPoint) throws Throwable {
        logger.info("======== 權限驗證 AOP ======== " + System.currentTimeMillis());

        Object[] args = joinPoint.getArgs();
        User user = (User) args[0];
        String account = user.getAccount();
        String passwd = user.getPasswd();

        logger.info("account ====> " + account);
        logger.info("passwd =====> " + passwd);

        if(!account.equals("user2") && !passwd.equals("$2a$10$somehashedpassword2")) {
            return JSON.parseObject("{\"message\":\"非管理人員\",\"code\":403}");
        }
        return joinPoint.proceed();
    }

}
