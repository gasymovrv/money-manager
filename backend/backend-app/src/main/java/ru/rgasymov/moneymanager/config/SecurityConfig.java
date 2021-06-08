package ru.rgasymov.moneymanager.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;
import ru.rgasymov.moneymanager.service.impl.CustomOidcUserService;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  private static final String BASE_URL = "/";

  @Value("${server.api-base-url}")
  private String apiBaseUrl;

  @Value("${server.servlet.session.limit}")
  private int maximumSessions;

  private final CustomOidcUserService customOidcUserService;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
        .sessionManagement()
        .maximumSessions(maximumSessions)
        .expiredUrl("/login")
        .sessionRegistry(sessionRegistry())
        .and()
        .invalidSessionUrl("/login")
        .and()
        .authorizeRequests()
        .antMatchers(HttpMethod.GET,
            "/",
            "/login",
            apiBaseUrl + "/version",
            "/static/**").permitAll()
        .anyRequest().authenticated()
        .and()
        .addFilterBefore(new ErrorFilter(apiBaseUrl, BASE_URL), FilterSecurityInterceptor.class)
        .exceptionHandling().accessDeniedPage(BASE_URL)
        .and()
        .csrf().disable()
        .oauth2Login()
        .loginPage("/login")
        .userInfoEndpoint()
        .oidcUserService(customOidcUserService);
  }

  @Bean
  public SessionRegistry sessionRegistry() {
    return new SessionRegistryImpl();
  }
}
