package ru.rgasymov.moneymanager.domain.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Currency;
import javax.validation.ValidationException;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.rgasymov.moneymanager.domain.enums.AccountTheme;

@Schema
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class AccountRequestDto {

  @NotBlank
  private String name;

  @NotNull
  private AccountTheme theme;

  @NotNull
  private String currency;

  public void setCurrency(String currency) {
    try {
      Currency instance = Currency.getInstance(currency);
      this.currency = instance.getCurrencyCode();
    } catch (Exception e) {
      throw new ValidationException(String.format("Unsupported currency code '%s'", currency));
    }
  }
}
