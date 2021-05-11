package ru.rgasymov.moneymanager.mapper;

import java.util.Set;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import ru.rgasymov.moneymanager.domain.dto.response.IncomeTypeResponseDto;
import ru.rgasymov.moneymanager.domain.entity.IncomeType;

@Mapper(componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface IncomeTypeMapper {

  IncomeTypeResponseDto toDto(IncomeType entity);

  Set<IncomeTypeResponseDto> toDtos(Set<IncomeType> entities);
}
