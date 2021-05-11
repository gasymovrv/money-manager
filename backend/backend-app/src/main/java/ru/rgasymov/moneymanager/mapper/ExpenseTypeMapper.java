package ru.rgasymov.moneymanager.mapper;

import java.util.Set;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import ru.rgasymov.moneymanager.domain.dto.response.ExpenseTypeResponseDto;
import ru.rgasymov.moneymanager.domain.entity.ExpenseType;

@Mapper(componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExpenseTypeMapper {

  ExpenseTypeResponseDto toDto(ExpenseType entity);

  Set<ExpenseTypeResponseDto> toDtos(Set<ExpenseType> entities);
}
