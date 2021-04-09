package ru.rgasymov.moneymanager.mapper;

import java.util.List;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import ru.rgasymov.moneymanager.domain.dto.response.IncomeResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Income;

@Mapper(componentModel = "spring",
        uses = {IncomeTypeMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface IncomeMapper {

    @Named(value = "toDto")
    IncomeResponseDto toDto(Income entity);

    @IterableMapping(qualifiedByName = "toDto")
    List<IncomeResponseDto> toDtos(List<Income> entities);
}
