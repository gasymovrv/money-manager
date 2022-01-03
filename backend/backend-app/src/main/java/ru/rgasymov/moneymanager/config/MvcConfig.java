package ru.rgasymov.moneymanager.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

  private static final long MAX_AGE_SECS = 3600;

  @Override
  public void addViewControllers(ViewControllerRegistry registry) {
    registry.addViewController("/login").setViewName("forward:/");
    registry.addViewController("/profile").setViewName("forward:/");
    registry.addViewController("/welcome").setViewName("forward:/");
  }

  //@Override
  //public void addCorsMappings(CorsRegistry registry) {
  //  registry.addMapping("/**")
  //      .allowedOrigins("*")
  //      .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
  //      .allowedHeaders("*")
  //      .allowCredentials(true)
  //      .maxAge(MAX_AGE_SECS);
  //}
}