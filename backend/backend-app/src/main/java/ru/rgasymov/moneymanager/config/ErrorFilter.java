package ru.rgasymov.moneymanager.config;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.GenericFilterBean;

@RequiredArgsConstructor
@Slf4j
public class ErrorFilter extends GenericFilterBean {

  private static final String LOGIN_URL = "/login";

  private final String apiBaseUrl;

  @Override
  public void doFilter(ServletRequest request,
                       ServletResponse response,
                       FilterChain chain) throws IOException, ServletException {
    var rq = (HttpServletRequest) request;
    var rs = (HttpServletResponse) response;

    if (!rq.getRequestURI().startsWith(apiBaseUrl + "/")
        && HttpStatus.OK.value() != rs.getStatus()) {
      rs.sendRedirect(LOGIN_URL);
    } else {
      chain.doFilter(request, response);
    }
  }
}
