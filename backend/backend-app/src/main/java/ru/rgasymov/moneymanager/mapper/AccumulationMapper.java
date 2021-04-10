package ru.rgasymov.moneymanager.mapper;

import java.util.List;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import ru.rgasymov.moneymanager.domain.dto.response.AccumulationResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Accumulation;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AccumulationMapper {

    @Mapping(target = "userId", source = "user.id")
    @Named(value = "toDto")
    AccumulationResponseDto toDto(Accumulation entity);

    @IterableMapping(qualifiedByName = "toDto")
    List<AccumulationResponseDto> toDtos(List<Accumulation> entities);
}
