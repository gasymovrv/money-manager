package ru.rgasymov.moneymanager.config;

public class SecurityConfigOld {

  //private static final String BASE_URL = "/";
  //
  //@Value("${server.api-base-url}")
  //private String apiBaseUrl;
  //
  //@Value("${server.servlet.session.limit}")
  //private int maximumSessions;
  //
  //private final CustomOidcUserService customOidcUserService;
  //
  //@Override
  //protected void configure(HttpSecurity http) throws Exception {
  //  http
  //      .sessionManagement()
  //      .maximumSessions(maximumSessions)
  //      .expiredUrl("/login")
  //      .sessionRegistry(sessionRegistry())
  //      .and()
  //      .invalidSessionUrl("/login")
  //      .and()
  //      .authorizeRequests()
  //      .antMatchers(HttpMethod.GET,
  //          "/",
  //          "/login",
  //          apiBaseUrl + "/version",
  //          "/static/**").permitAll()
  //      .anyRequest().authenticated()
  //      .and()
  //      .addFilterBefore(new ErrorFilter(apiBaseUrl, BASE_URL), FilterSecurityInterceptor.class)
  //      .exceptionHandling().accessDeniedPage(BASE_URL)
  //      .and()
  //      .csrf().disable()
  //      .oauth2Login()
  //      .loginPage("/login")
  //      .userInfoEndpoint()
  //      .oidcUserService(customOidcUserService);
  //}
  //
  //@Bean
  //public SessionRegistry sessionRegistry() {
  //  return new SessionRegistryImpl();
  //}
}
