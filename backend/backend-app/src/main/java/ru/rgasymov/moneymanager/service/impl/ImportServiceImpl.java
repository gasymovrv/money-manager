package ru.rgasymov.moneymanager.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.domain.XlsxParsingResult;
import ru.rgasymov.moneymanager.domain.entity.Account;
import ru.rgasymov.moneymanager.domain.entity.BaseOperation;
import ru.rgasymov.moneymanager.domain.entity.ExpenseCategory;
import ru.rgasymov.moneymanager.domain.entity.IncomeCategory;
import ru.rgasymov.moneymanager.domain.entity.Saving;
import ru.rgasymov.moneymanager.repository.ExpenseCategoryRepository;
import ru.rgasymov.moneymanager.repository.ExpenseRepository;
import ru.rgasymov.moneymanager.repository.IncomeCategoryRepository;
import ru.rgasymov.moneymanager.repository.IncomeRepository;
import ru.rgasymov.moneymanager.repository.SavingRepository;
import ru.rgasymov.moneymanager.service.ImportService;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@RequiredArgsConstructor
public class ImportServiceImpl implements ImportService {

  private final SavingRepository savingRepository;
  private final IncomeRepository incomeRepository;
  private final ExpenseRepository expenseRepository;
  private final IncomeCategoryRepository incomeCategoryRepository;
  private final ExpenseCategoryRepository expenseCategoryRepository;

  private final UserService userService;

  @Transactional(readOnly = true)
  @Override
  public boolean isNonReadyForImport() {
    var currentAccount = userService.getCurrentUser().getCurrentAccount();
    var currentAccountId = currentAccount.getId();

    return savingRepository.existsByAccountId(currentAccountId)
        || incomeCategoryRepository.existsByAccountId(currentAccountId)
        || expenseCategoryRepository.existsByAccountId(currentAccountId);
  }

  @Transactional
  @Override
  public void importFromXlsx(XlsxParsingResult parsingResult) {
    if (isNonReadyForImport()) {
      return;
    }
    var currentAccount = userService.getCurrentUser().getCurrentAccount();

    Map<LocalDate, Saving> savings = new HashMap<>();

    BigDecimal previousSavings = parsingResult.getPreviousSavings();
    LocalDate previousSavingsDate = parsingResult.getPreviousSavingsDate();

    if (previousSavings != null && previousSavingsDate != null) {
      savings.put(
          previousSavingsDate,
          Saving.builder()
              .date(previousSavingsDate)
              .value(previousSavings)
              .account(currentAccount)
              .build());
    }

    var sortedIncomes = parsingResult.getIncomes();
    var sortedExpenses = parsingResult.getExpenses();
    sortedIncomes.sort(Comparator.comparing(BaseOperation::getDate));
    sortedExpenses.sort(Comparator.comparing(BaseOperation::getDate));

    //Prepare savings
    sortedIncomes.forEach(income -> {
      final var date = income.getDate();
      final var value = income.getValue();
      recalculateMap(savings, date, value, BigDecimal::add, currentAccount);
    });
    sortedExpenses.forEach(expense -> {
      final var date = expense.getDate();
      final var value = expense.getValue();
      recalculateMap(savings, date, value, BigDecimal::subtract, currentAccount);
    });

    var savedIncCategories = incomeCategoryRepository
        .saveAll(parsingResult.getIncomeCategories())
        .stream()
        .collect(Collectors.toMap(IncomeCategory::getName, Function.identity()));
    var savedExpCategories = expenseCategoryRepository
        .saveAll(parsingResult.getExpenseCategories())
        .stream()
        .collect(Collectors.toMap(ExpenseCategory::getName, Function.identity()));
    var savedSavings = savingRepository.saveAll(savings.values())
        .stream()
        .collect(Collectors.toMap(Saving::getDate, Function.identity()));

    sortedIncomes.forEach(income -> {
      var categoryName = income.getCategory().getName();
      var date = income.getDate();
      income.setCategory(savedIncCategories.get(categoryName));
      income.setSaving(savedSavings.get(date));
    });
    sortedExpenses.forEach(expense -> {
      var categoryName = expense.getCategory().getName();
      var date = expense.getDate();
      expense.setCategory(savedExpCategories.get(categoryName));
      expense.setSaving(savedSavings.get(date));
    });
    incomeRepository.saveAll(sortedIncomes);
    expenseRepository.saveAll(sortedExpenses);
  }

  private void recalculateMap(Map<LocalDate, Saving> savings,
                              LocalDate date,
                              BigDecimal value,
                              BiFunction<BigDecimal, BigDecimal, BigDecimal> setValueFunc,
                              Account currentAccount) {
    final var saving = savings.get(date);

    if (saving != null) {
      saving.setValue(setValueFunc.apply(saving.getValue(), value));
    } else {
      var lastSavingValue = savings.values()
          .stream()
          .filter(s -> s.getDate().isBefore(date))
          .max(Comparator.comparing(Saving::getDate))
          .map(Saving::getValue)
          .orElse(BigDecimal.ZERO);

      var newSaving = Saving.builder()
          .date(date)
          .value(setValueFunc.apply(lastSavingValue, value))
          .account(currentAccount)
          .build();
      savings.put(date, newSaving);
    }
    savings.values()
        .stream()
        .filter(s -> s.getDate().isAfter(date))
        .forEach(s -> s.setValue(setValueFunc.apply(s.getValue(), value)));
  }
}
