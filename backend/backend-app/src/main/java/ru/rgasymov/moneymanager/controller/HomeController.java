package ru.rgasymov.moneymanager.controller;

import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import springfox.documentation.annotations.ApiIgnore;

@ApiIgnore
@Controller
@RequiredArgsConstructor
@RequestMapping("/")
@Slf4j
public class HomeController {

  @GetMapping
  public String root(HttpServletResponse response) {
    response.setHeader(HttpHeaders.CACHE_CONTROL, "no-cache, must-revalidate, no-store");
    response.setHeader(HttpHeaders.EXPIRES, "0");
    return "index.html";
  }
}
