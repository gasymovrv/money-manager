package ru.rgasymov.moneymanager.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.annotations.ApiModel;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import lombok.Builder;
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

  @Builder.Default
  private BigDecimal incomesSum = BigDecimal.ZERO;

  @Builder.Default
  private BigDecimal expensesSum = BigDecimal.ZERO;

  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Map<String, List<IncomeResponseDto>> incomesByType;

  @EqualsAndHashCode.Exclude
  @ToString.Exclude
  private Map<String, List<ExpenseResponseDto>> expensesByType;
}