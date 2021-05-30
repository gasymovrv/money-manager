package ru.rgasymov.moneymanager.mapper;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import ru.rgasymov.moneymanager.domain.dto.response.OperationResponseDto;
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
    var isOverdue = new AtomicBoolean(false);
    LocalDate now = LocalDate.now();
    var isBeforeOrEqualToday = (entity.getDate().isBefore(now)
        || entity.getDate().isEqual(now));

    var expenseMap = new HashMap<String, List<OperationResponseDto>>();

    entity.getExpenses().forEach((exp) -> {
      if (isBeforeOrEqualToday && Boolean.TRUE.equals(exp.getIsPlanned())) {
        isOverdue.set(true);
      }
      dto.setExpensesSum(dto.getExpensesSum().add(exp.getValue()));

      ArrayList<OperationResponseDto> value = new ArrayList<>();
      value.add(expenseMapper.toDto(exp));
      expenseMap.merge(exp.getCategory().getName(), value,
          ((list1, list2) -> {
            list1.addAll(value);
            return list1;
          }));
    });

    var incomeMap = new HashMap<String, List<OperationResponseDto>>();

    entity.getIncomes().forEach((inc) -> {
      if (isBeforeOrEqualToday && Boolean.TRUE.equals(inc.getIsPlanned())) {
        isOverdue.set(true);
      }
      dto.setIncomesSum(dto.getIncomesSum().add(inc.getValue()));

      ArrayList<OperationResponseDto> value = new ArrayList<>();
      value.add(incomeMapper.toDto(inc));
      incomeMap.merge(inc.getCategory().getName(), value,
          ((list1, list2) -> {
            list1.addAll(value);
            return list1;
          }));
    });

    dto.setOverdue(isOverdue.get());
    dto.setExpensesByCategory(expenseMap);
    dto.setIncomesByCategory(incomeMap);
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
