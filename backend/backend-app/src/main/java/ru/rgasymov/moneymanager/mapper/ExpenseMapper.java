package ru.rgasymov.moneymanager.mapper;

import java.util.List;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
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
  @Named(value = "toDto")
  ExpenseResponseDto toDto(Expense entity);

  @IterableMapping(qualifiedByName = "toDto")
  List<ExpenseResponseDto> toDtos(List<Expense> entities);
}
