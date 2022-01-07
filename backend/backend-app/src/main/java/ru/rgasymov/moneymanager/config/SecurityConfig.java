package ru.rgasymov.moneymanager.config;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.FormHttpMessageConverter;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.endpoint.DefaultAuthorizationCodeTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AccessTokenResponseClient;
import org.springframework.security.oauth2.client.endpoint.OAuth2AuthorizationCodeGrantRequest;
import org.springframework.security.oauth2.client.http.OAuth2ErrorResponseErrorHandler;
import org.springframework.security.oauth2.core.http.converter.OAuth2AccessTokenResponseHttpMessageConverter;
import org.springframework.security.web.access.intercept.FilterSecurityInterceptor;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import ru.rgasymov.moneymanager.security.RestAuthenticationEntryPoint;
import ru.rgasymov.moneymanager.security.TokenAuthenticationFilter;
import ru.rgasymov.moneymanager.security.oauth2.CustomOauth2UserService;
import ru.rgasymov.moneymanager.security.oauth2.CustomTokenResponseConverter;
import ru.rgasymov.moneymanager.security.oauth2.HttpCookieOauth2AuthorizationRequestRepository;
import ru.rgasymov.moneymanager.security.oauth2.Oauth2AuthenticationFailureHandler;
import ru.rgasymov.moneymanager.security.oauth2.Oauth2AuthenticationSuccessHandler;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableGlobalMethodSecurity(
    securedEnabled = true,
    jsr250Enabled = true,
    prePostEnabled = true
)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  private static final String BASE_URL = "/";

  @Value("${server.api-base-url}")
  private String apiBaseUrl;

  private final CustomOauth2UserService customOauth2UserService;

  private final Oauth2AuthenticationSuccessHandler authenticationSuccessHandler;

  private final Oauth2AuthenticationFailureHandler authenticationFailureHandler;

  @Bean
  public TokenAuthenticationFilter tokenAuthenticationFilter() {
    return new TokenAuthenticationFilter();
  }

  /*
    By default, Spring OAuth2 uses HttpSessionOAuth2AuthorizationRequestRepository to save
    the authorization request. But, since our service is stateless, we can't save it in
    the session. We'll save the request in a Base64 encoded cookie instead.
  */
  @Bean
  public HttpCookieOauth2AuthorizationRequestRepository cookieAuthorizationRequestRepository() {
    return new HttpCookieOauth2AuthorizationRequestRepository();
  }

  @Bean
  public OAuth2AccessTokenResponseClient<OAuth2AuthorizationCodeGrantRequest>
      accessTokenResponseClient() {
    var tokenResponseHttpMessageConverter = new OAuth2AccessTokenResponseHttpMessageConverter();
    tokenResponseHttpMessageConverter
        .setAccessTokenResponseConverter(new CustomTokenResponseConverter());

    var restTemplate = new RestTemplate(
        List.of(new FormHttpMessageConverter(), tokenResponseHttpMessageConverter));
    restTemplate.setErrorHandler(new OAuth2ErrorResponseErrorHandler());

    var accessTokenResponseClient = new DefaultAuthorizationCodeTokenResponseClient();
    accessTokenResponseClient.setRestOperations(restTemplate);
    return accessTokenResponseClient;
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http
        .cors()
        .and()
        .sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
        .csrf()
        .disable()
        .formLogin()
        .disable()
        .httpBasic()
        .disable()
        .addFilterBefore(new ErrorFilter(apiBaseUrl, BASE_URL), FilterSecurityInterceptor.class)
        .exceptionHandling()
        .authenticationEntryPoint(new RestAuthenticationEntryPoint(apiBaseUrl))
        .and()
        .authorizeRequests()
        .antMatchers(
            BASE_URL,
            "/login",
            apiBaseUrl + "/version",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/favicon.ico",
            "/static/**")
        .permitAll()
        .antMatchers("/auth/**", "/oauth2/**")
        .permitAll()
        .anyRequest()
        .hasRole("USER")
        .and()
        .oauth2Login()
        .authorizationEndpoint()
        .baseUri("/oauth2/authorize")
        .authorizationRequestRepository(cookieAuthorizationRequestRepository())
        .and()
        .redirectionEndpoint()
        .baseUri("/oauth2/callback/*")
        .and()
        .userInfoEndpoint()
        .userService(customOauth2UserService)
        .and()
        .tokenEndpoint()
        .accessTokenResponseClient(accessTokenResponseClient())
        .and()
        .successHandler(authenticationSuccessHandler)
        .failureHandler(authenticationFailureHandler);

    // Add our custom Token based authentication filter
    http.addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
  }
}
