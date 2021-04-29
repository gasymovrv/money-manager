package ru.rgasymov.moneymanager.mapper;

import java.util.List;
import org.mapstruct.DecoratedWith;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import ru.rgasymov.moneymanager.domain.dto.response.AccumulationResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Accumulation;

@Mapper(componentModel = "spring",
    uses = {IncomeMapper.class, ExpenseMapper.class},
    unmappedTargetPolicy = ReportingPolicy.IGNORE)
@DecoratedWith(AccumulationMapperDecorator.class)
public interface AccumulationMapper {

  @Mapping(target = "userId", source = "user.id")
  AccumulationResponseDto toDto(Accumulation entity);

  List<AccumulationResponseDto> toDtos(List<Accumulation> entities);
}
