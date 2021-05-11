package ru.rgasymov.moneymanager.mapper;

import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import ru.rgasymov.moneymanager.domain.dto.response.ExpenseResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Expense;

@Mapper(componentModel = "spring",
    uses = {ExpenseTypeMapper.class, AccumulationMapper.class},
    unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExpenseMapper {

  @Mapping(target = "accumulation.incomes", ignore = true)
  @Mapping(target = "accumulation.expenses", ignore = true)
  @Mapping(target = "userId", source = "user.id")
  ExpenseResponseDto toDto(Expense entity);

  List<ExpenseResponseDto> toDtos(List<Expense> entities);
}
