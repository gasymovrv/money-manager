package ru.rgasymov.moneymanager.security;

import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

@Slf4j
@RequiredArgsConstructor
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

  private final String apiBaseUrl;

  @Override
  public void commence(HttpServletRequest httpServletRequest,
                       HttpServletResponse httpServletResponse,
                       AuthenticationException e) throws IOException {
    log.error("Responding with unauthorized error. Message - {}", e.getMessage());
    if (httpServletRequest.getRequestURI().startsWith(apiBaseUrl + "/")) {
      httpServletResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED,
          e.getLocalizedMessage());
    } else {
      httpServletResponse.sendRedirect("/login");
    }
  }
}
