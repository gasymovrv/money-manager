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

  private final String apiBaseUrl;

  private final String baseUrl;

  @Override
  public void doFilter(ServletRequest request,
                       ServletResponse response,
                       FilterChain chain) throws IOException, ServletException {
    HttpServletRequest rq = (HttpServletRequest) request;
    HttpServletResponse rs = (HttpServletResponse) response;

    if (!rq.getRequestURI().startsWith(apiBaseUrl + "/")
        && HttpStatus.NOT_FOUND.value() == rs.getStatus()) {
      rs.sendRedirect(baseUrl);
    } else {
      chain.doFilter(request, response);
    }
  }
}
