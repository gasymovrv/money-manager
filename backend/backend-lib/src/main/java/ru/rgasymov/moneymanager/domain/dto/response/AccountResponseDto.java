package ru.rgasymov.moneymanager.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import ru.rgasymov.moneymanager.domain.enums.AccountTheme;
import ru.rgasymov.moneymanager.domain.enums.Currency;

@ApiModel
@Data
@NoArgsConstructor
@SuperBuilder
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class AccountResponseDto {

  private Long id;

  private String name;

  private AccountTheme theme;

  private Currency currency;

  @Builder.Default
  @JsonProperty("isDraft")
  private boolean isDraft = true;
}
