package ru.rgasymov.moneymanager.domain.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModel;
import javax.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.rgasymov.moneymanager.domain.enums.AccountTheme;
import ru.rgasymov.moneymanager.domain.enums.Currency;

@ApiModel
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class AccountRequestDto {

  @NotNull
  private String name;

  @NotNull
  private AccountTheme theme;

  @NotNull
  private Currency currency;
}
