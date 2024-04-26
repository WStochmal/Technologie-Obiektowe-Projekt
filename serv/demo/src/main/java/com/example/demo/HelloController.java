package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Witaj, świecie!";
    }

    @GetMapping("/square/{num}")
    public int square(@PathVariable int num) {
        return num * num;
    }
}
