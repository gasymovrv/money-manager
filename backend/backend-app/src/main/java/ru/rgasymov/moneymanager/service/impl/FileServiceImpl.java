package ru.rgasymov.moneymanager.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.rgasymov.moneymanager.domain.XlsxInputData;
import ru.rgasymov.moneymanager.domain.XlsxParsingResult;
import ru.rgasymov.moneymanager.domain.dto.request.SavingCriteriaDto;
import ru.rgasymov.moneymanager.domain.entity.ExpenseCategory;
import ru.rgasymov.moneymanager.domain.entity.IncomeCategory;
import ru.rgasymov.moneymanager.exception.EmptyDataGenerationException;
import ru.rgasymov.moneymanager.exception.UploadFileException;
import ru.rgasymov.moneymanager.repository.ExpenseCategoryRepository;
import ru.rgasymov.moneymanager.repository.IncomeCategoryRepository;
import ru.rgasymov.moneymanager.service.ExpenseService;
import ru.rgasymov.moneymanager.service.FileService;
import ru.rgasymov.moneymanager.service.IncomeService;
import ru.rgasymov.moneymanager.service.SavingService;
import ru.rgasymov.moneymanager.service.UserService;
import ru.rgasymov.moneymanager.service.XlsxFileService;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

  public static final int MAX_SAVINGS = 1_000_000;

  private final XlsxFileService xlsxFileService;

  private final UserService userService;

  private final IncomeCategoryRepository incomeCategoryRepository;

  private final ExpenseCategoryRepository expenseCategoryRepository;

  private final SavingService savingService;

  private final IncomeService incomeService;

  private final ExpenseService expenseService;

  @Transactional(propagation = Propagation.NEVER)
  @Override
  public void importFromXlsx(MultipartFile file) {
    var currentUser = userService.getCurrentUser();
    var currentAccountId = currentUser.getCurrentAccount().getId();

    if (incomeCategoryRepository.existsByAccountId(currentAccountId)
        || expenseCategoryRepository.existsByAccountId(currentAccountId)) {
      throw new UploadFileException(
          "# Failed to import .xlsx file because current account is not empty");
    }

    XlsxParsingResult result = xlsxFileService.parse(file);

    BigDecimal previousSavings = result.getPreviousSavings();
    LocalDate previousSavingsDate = result.getPreviousSavingsDate();
    if (previousSavings != null && previousSavingsDate != null) {
      if (previousSavings.signum() < 0) {
        savingService.decrease(previousSavings.abs(), previousSavingsDate);
      } else {
        savingService.increase(previousSavings, previousSavingsDate);
      }
    }

    Map<String, IncomeCategory> incomeCategories = incomeCategoryRepository
        .saveAll(result.getIncomeCategories())
        .stream()
        .collect(Collectors.toMap(IncomeCategory::getName, incomeCategory -> incomeCategory));

    Map<String, ExpenseCategory> expenseCategories = expenseCategoryRepository
        .saveAll(result.getExpenseCategories())
        .stream()
        .collect(Collectors.toMap(ExpenseCategory::getName, expenseCategory -> expenseCategory));

    result.getIncomes().forEach((income -> {
      var categoryName = income.getCategory().getName();
      income.setCategory(incomeCategories.get(categoryName));
      incomeService.create(income);
    }));

    result.getExpenses().forEach((expense -> {
      var categoryName = expense.getCategory().getName();
      expense.setCategory(expenseCategories.get(categoryName));
      expenseService.create(expense);
    }));
  }

  @Override
  public ResponseEntity<Resource> exportToXlsx() {
    var criteria = new SavingCriteriaDto();
    criteria.setPageSize(MAX_SAVINGS);
    var result = savingService.search(criteria);
    var savings = result.getResult();
    if (CollectionUtils.isEmpty(savings)) {
      throw new EmptyDataGenerationException("There is no data in current account to export");
    }

    return xlsxFileService.generate(
        new XlsxInputData(
            savings,
            result.getIncomeCategories(),
            result.getExpenseCategories()));
  }

  @Override
  public ResponseEntity<Resource> getXlsxTemplate() {
    return xlsxFileService.getTemplate();
  }
}
