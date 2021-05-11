package ru.rgasymov.moneymanager.mapper;

import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import ru.rgasymov.moneymanager.domain.dto.response.IncomeResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Income;

@Mapper(componentModel = "spring",
    uses = {IncomeTypeMapper.class, AccumulationMapper.class},
    unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface IncomeMapper {

  @Mapping(target = "accumulation.incomes", ignore = true)
  @Mapping(target = "accumulation.expenses", ignore = true)
  @Mapping(target = "userId", source = "user.id")
  IncomeResponseDto toDto(Income entity);

  List<IncomeResponseDto> toDtos(List<Income> entities);
}
