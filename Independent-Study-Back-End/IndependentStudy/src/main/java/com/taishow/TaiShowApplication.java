package com.taishow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@Async
@EnableTransactionManagement
@EnableScheduling
public class TaiShowApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaiShowApplication.class, args);
    }
}