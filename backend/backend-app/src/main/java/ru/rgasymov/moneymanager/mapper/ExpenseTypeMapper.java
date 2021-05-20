package ru.rgasymov.moneymanager.mapper;

import java.util.Set;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import ru.rgasymov.moneymanager.domain.dto.response.OperationTypeResponseDto;
import ru.rgasymov.moneymanager.domain.entity.ExpenseType;

@Mapper(componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExpenseTypeMapper extends BaseOperationTypeMapper<ExpenseType> {

  OperationTypeResponseDto toDto(ExpenseType entity);

  Set<OperationTypeResponseDto> toDtos(Set<ExpenseType> entities);
}
