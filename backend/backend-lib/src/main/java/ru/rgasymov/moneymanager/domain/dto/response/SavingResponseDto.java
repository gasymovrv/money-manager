package ru.rgasymov.moneymanager.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModel;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;
import ru.rgasymov.moneymanager.constant.DateTimeFormats;

@ApiModel
@Data
@NoArgsConstructor
@SuperBuilder
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class SavingResponseDto {

  private Long id;

  private String userId;

  @JsonFormat(shape = JsonFormat.Shape.STRING,
      pattern = DateTimeFormats.COMMON_DATE_FORMAT)
  private LocalDate date;

  private BigDecimal value;

  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private List<IncomeResponseDto> incomes;

  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private List<ExpenseResponseDto> expenses;

  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Map<String, IncomeResponseDto> incomesByType;

  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Map<String, ExpenseResponseDto> expensesByType;
}
