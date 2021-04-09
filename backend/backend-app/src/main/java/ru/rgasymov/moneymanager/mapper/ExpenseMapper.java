package ru.rgasymov.moneymanager.mapper;

import java.util.List;
import org.mapstruct.IterableMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;
import ru.rgasymov.moneymanager.domain.dto.response.ExpenseResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Expense;

@Mapper(componentModel = "spring",
        uses = {ExpenseTypeMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExpenseMapper {

    @Named(value = "toDto")
    ExpenseResponseDto toDto(Expense entity);

    @IterableMapping(qualifiedByName = "toDto")
    List<ExpenseResponseDto> toDtos(List<Expense> entities);
}
