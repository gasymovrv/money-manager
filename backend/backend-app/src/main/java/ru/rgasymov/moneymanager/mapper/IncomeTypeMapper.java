package ru.rgasymov.moneymanager.mapper;

import java.util.Set;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import ru.rgasymov.moneymanager.domain.dto.response.OperationTypeResponseDto;
import ru.rgasymov.moneymanager.domain.entity.IncomeType;

@Mapper(componentModel = "spring",
    unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface IncomeTypeMapper extends BaseOperationTypeMapper<IncomeType> {

  OperationTypeResponseDto toDto(IncomeType entity);

  Set<OperationTypeResponseDto> toDtos(Set<IncomeType> entities);
}
