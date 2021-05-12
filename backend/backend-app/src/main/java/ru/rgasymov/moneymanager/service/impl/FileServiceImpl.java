package ru.rgasymov.moneymanager.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.rgasymov.moneymanager.domain.XlsxParsingResult;
import ru.rgasymov.moneymanager.domain.dto.request.SavingCriteriaDto;
import ru.rgasymov.moneymanager.domain.entity.ExpenseType;
import ru.rgasymov.moneymanager.domain.entity.IncomeType;
import ru.rgasymov.moneymanager.exception.UploadFileException;
import ru.rgasymov.moneymanager.repository.ExpenseTypeRepository;
import ru.rgasymov.moneymanager.repository.IncomeTypeRepository;
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

  private final IncomeTypeRepository incomeTypeRepository;

  private final ExpenseTypeRepository expenseTypeRepository;

  private final SavingService savingService;

  private final IncomeService incomeService;

  private final ExpenseService expenseService;

  @Transactional(propagation = Propagation.NEVER)
  @Override
  public void uploadXlsx(MultipartFile file) {
    var currentUser = userService.getCurrentUser();
    var currentUserId = currentUser.getId();

    if (incomeTypeRepository.existsByUserId(currentUserId)
        || expenseTypeRepository.existsByUserId(currentUserId)) {
      throw new UploadFileException(
          "# Failed to upload .xlsx file because the database is not empty");
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

    Map<String, IncomeType> incomeTypes = incomeTypeRepository
        .saveAll(result.getIncomeTypes())
        .stream()
        .collect(Collectors.toMap(IncomeType::getName, incomeType -> incomeType));

    Map<String, ExpenseType> expenseTypes = expenseTypeRepository
        .saveAll(result.getExpenseTypes())
        .stream()
        .collect(Collectors.toMap(ExpenseType::getName, expenseType -> expenseType));

    result.getIncomes().forEach((income -> {
      var typeName = income.getIncomeType().getName();
      income.setIncomeType(incomeTypes.get(typeName));
      incomeService.create(income);
    }));

    result.getExpenses().forEach((expense -> {
      var typeName = expense.getExpenseType().getName();
      expense.setExpenseType(expenseTypes.get(typeName));
      expenseService.create(expense);
    }));
  }

  @Override
  public ResponseEntity<Resource> generateXlsx() {
    var criteria = new SavingCriteriaDto();
    criteria.setPageSize(MAX_SAVINGS);
    return xlsxFileService.generate(savingService.search(criteria).getResult());
  }

  @Override
  public ResponseEntity<Resource> getXlsxTemplate() {
    return xlsxFileService.getTemplate();
  }
}
