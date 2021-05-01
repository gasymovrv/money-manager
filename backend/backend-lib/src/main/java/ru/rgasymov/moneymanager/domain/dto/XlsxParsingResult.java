package ru.rgasymov.moneymanager.domain.dto;

import java.util.List;
import java.util.Set;
import ru.rgasymov.moneymanager.domain.entity.Expense;
import ru.rgasymov.moneymanager.domain.entity.ExpenseType;
import ru.rgasymov.moneymanager.domain.entity.Income;
import ru.rgasymov.moneymanager.domain.entity.IncomeType;

public record XlsxParsingResult(
    List<Income> incomes,
    List<Expense> expenses,
    Set<IncomeType> incomeTypes,
    Set<ExpenseType> expenseTypes
) {
  public void add(XlsxParsingResult result) {
    incomes.addAll(result.incomes);
    expenses.addAll(result.expenses);
    incomeTypes.addAll(result.incomeTypes);
    expenseTypes.addAll(result.expenseTypes);
  }
}
