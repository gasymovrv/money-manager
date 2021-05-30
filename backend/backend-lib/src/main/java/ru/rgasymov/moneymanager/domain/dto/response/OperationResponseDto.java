package ru.rgasymov.moneymanager.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.annotations.ApiModel;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import ru.rgasymov.moneymanager.constant.DateTimeFormats;

@ApiModel
@Data
@NoArgsConstructor
@SuperBuilder
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class OperationResponseDto {

  private Long id;

  private String userId;

  private OperationCategoryResponseDto category;

  @JsonFormat(shape = JsonFormat.Shape.STRING,
      pattern = DateTimeFormats.COMMON_DATE_FORMAT)
  private LocalDate date;

  private String description;

  private BigDecimal value;

  @JsonProperty("isPlanned")
  private boolean isPlanned;
}
