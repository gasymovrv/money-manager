package ru.rgasymov.moneymanager.config;

import com.fasterxml.classmate.TypeResolver;
import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.info.BuildProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.rgasymov.moneymanager.domain.dto.response.ErrorDto;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

@Configuration
@RequiredArgsConstructor
public class SwaggerConfig {

  private final BuildProperties buildProperties;

  @Bean
  public Docket api(TypeResolver typeResolver) {
    ApiInfo apiInfo = new ApiInfo(
        "Money-Manager",
        "Collection and Management tool for Money-Manager application",
        buildProperties.getVersion(),
        "terms of service url",
        new Contact("Test", "http://test.com", "test@gmail.com"),
        "license",
        "http://license.com",
        Collections.emptyList()
    );

    return new Docket(DocumentationType.SWAGGER_2)
        .select()
        .apis(RequestHandlerSelectors.basePackage("ru.rgasymov.moneymanager.controller"))
        .build()
        .apiInfo(apiInfo)
        .additionalModels(typeResolver.resolve(ErrorDto.class));
  }
}