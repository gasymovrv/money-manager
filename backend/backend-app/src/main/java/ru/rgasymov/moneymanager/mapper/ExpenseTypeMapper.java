package ru.rgasymov.moneymanager.mapper;

import java.util.Set;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import ru.rgasymov.moneymanager.domain.dto.response.ExpenseTypeResponseDto;
import ru.rgasymov.moneymanager.domain.entity.ExpenseType;

@Mapper(componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExpenseTypeMapper {

  @Named(value = "toDto")
  ExpenseTypeResponseDto toDto(ExpenseType entity);

  @IterableMapping(qualifiedByName = "toDto")
  Set<ExpenseTypeResponseDto> toDtos(Set<ExpenseType> entities);
}
