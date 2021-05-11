package ru.rgasymov.moneymanager.domain;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import ru.rgasymov.moneymanager.domain.entity.Expense;
import ru.rgasymov.moneymanager.domain.entity.ExpenseType;
import ru.rgasymov.moneymanager.domain.entity.Income;
import ru.rgasymov.moneymanager.domain.entity.IncomeType;

@Data
@RequiredArgsConstructor
public class XlsxParsingResult {
  private BigDecimal previousSavings;
  private LocalDate previousSavingsDate;
  private final List<Income> incomes;
  private final List<Expense> expenses;
  private final Set<IncomeType> incomeTypes;
  private final Set<ExpenseType> expenseTypes;

  public void add(XlsxParsingResult result) {
    incomes.addAll(result.incomes);
    expenses.addAll(result.expenses);
    incomeTypes.addAll(result.incomeTypes);
    expenseTypes.addAll(result.expenseTypes);
  }
}
