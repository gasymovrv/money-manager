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
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.filter.GenericFilterBean;
import ru.rgasymov.moneymanager.util.SecurityContextUtils;

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
        try {
            if (HttpStatus.NOT_FOUND.value() == rs.getStatus()) {
                rs.sendRedirect(baseUrl);
            } else {
                chain.doFilter(request, response);
            }
        } catch (AccessDeniedException e) {
            if (rq.getRequestURI().startsWith(apiBaseUrl + "/")) {
                if (SecurityContextUtils.isAnonymous()) {
                    rs.sendError(HttpStatus.UNAUTHORIZED.value());
                } else {
                    rs.sendError(HttpStatus.FORBIDDEN.value());
                }
            } else {
                throw e;
            }
        }
    }
}
