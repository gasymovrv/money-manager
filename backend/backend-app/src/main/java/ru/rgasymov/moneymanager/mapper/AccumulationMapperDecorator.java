package ru.rgasymov.moneymanager.mapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import ru.rgasymov.moneymanager.domain.dto.response.AccumulationResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.ExpenseResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.IncomeResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Accumulation;

@NoArgsConstructor
public class AccumulationMapperDecorator implements AccumulationMapper {

  @Autowired
  private AccumulationMapper delegate;

  @Override
  public AccumulationResponseDto toDto(Accumulation entity) {
    AccumulationResponseDto dto = delegate.toDto(entity);

    //todo remove merging, add expenses lists
    Map<String, ExpenseResponseDto> expenseMap = new HashMap<>();
    dto.getExpenses().forEach((exp) ->
        expenseMap.merge(exp.getExpenseType().getName(), exp,
            ((dto1, dto2) -> {
              dto1.setValue(dto1.getValue().add(dto2.getValue()));
              return dto1;
            })));

    //todo remove merging, add incomes lists
    Map<String, IncomeResponseDto> incomeMap = new HashMap<>();
    dto.getIncomes().forEach((inc) ->
        incomeMap.merge(inc.getIncomeType().getName(), inc,
            ((dto1, dto2) -> {
              dto1.setValue(dto1.getValue().add(dto2.getValue()));
              return dto1;
            })));

    dto.setExpensesByType(expenseMap);
    dto.setIncomesByType(incomeMap);
    return dto;
  }

  @Override
  public List<AccumulationResponseDto> toDtos(List<Accumulation> entities) {
    if (entities == null) {
      return null;
    }

    List<AccumulationResponseDto> list = new ArrayList<>(entities.size());
    for (Accumulation accumulation : entities) {
      list.add(toDto(accumulation));
    }

    return list;
  }
}
