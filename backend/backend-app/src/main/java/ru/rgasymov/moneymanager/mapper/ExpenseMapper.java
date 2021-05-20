package ru.rgasymov.moneymanager.mapper;

import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import ru.rgasymov.moneymanager.domain.dto.response.OperationResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Expense;

@Mapper(componentModel = "spring",
    uses = {ExpenseTypeMapper.class, SavingMapper.class},
    unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExpenseMapper extends BaseOperationMapper<Expense> {

  @Mapping(target = "userId", source = "user.id")
  OperationResponseDto toDto(Expense entity);

  List<OperationResponseDto> toDtos(List<Expense> entities);
}
