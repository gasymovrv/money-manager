package ru.rgasymov.moneymanager.mapper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import ru.rgasymov.moneymanager.domain.dto.response.ExpenseResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.IncomeResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.SavingResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Saving;

@NoArgsConstructor
public class SavingMapperDecorator implements SavingMapper {

  @Autowired
  private SavingMapper delegate;

  @Override
  public SavingResponseDto toDto(Saving entity) {
    SavingResponseDto dto = delegate.toDto(entity);

    //todo remove merging, add expenses lists
    var expenseMap = new HashMap<String, ExpenseResponseDto>();
    dto.getExpenses().forEach((exp) ->
        expenseMap.merge(exp.getExpenseType().getName(), exp,
            ((dto1, dto2) -> {
              dto1.setValue(dto1.getValue().add(dto2.getValue()));
              return dto1;
            })));

    //todo remove merging, add incomes lists
    var incomeMap = new HashMap<String, IncomeResponseDto>();
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
  public List<SavingResponseDto> toDtos(List<Saving> entities) {
    if (entities == null) {
      return null;
    }

    var list = new ArrayList<SavingResponseDto>(entities.size());
    for (Saving saving : entities) {
      list.add(toDto(saving));
    }

    return list;
  }
}
