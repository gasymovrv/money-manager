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
  private IncomeMapper incomeMapper;

  @Autowired
  private ExpenseMapper expenseMapper;

  @Autowired
  private SavingMapper delegate;

  @Override
  public SavingResponseDto toDto(Saving entity) {
    SavingResponseDto dto = delegate.toDto(entity);

    var expenseMap = new HashMap<String, List<ExpenseResponseDto>>();

    entity.getExpenses().forEach((exp) -> {
      dto.setExpensesSum(dto.getExpensesSum().add(exp.getValue()));

      ArrayList<ExpenseResponseDto> value = new ArrayList<>();
      value.add(expenseMapper.toDto(exp));
      expenseMap.merge(exp.getExpenseType().getName(), value,
          ((list1, list2) -> {
            list1.addAll(value);
            return list1;
          }));
    });

    var incomeMap = new HashMap<String, List<IncomeResponseDto>>();

    entity.getIncomes().forEach((inc) -> {
      dto.setIncomesSum(dto.getIncomesSum().add(inc.getValue()));

      ArrayList<IncomeResponseDto> value = new ArrayList<>();
      value.add(incomeMapper.toDto(inc));
      incomeMap.merge(inc.getIncomeType().getName(), value,
          ((list1, list2) -> {
            list1.addAll(value);
            return list1;
          }));
    });

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
