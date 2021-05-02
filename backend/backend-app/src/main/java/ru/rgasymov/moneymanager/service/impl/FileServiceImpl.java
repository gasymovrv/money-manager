package ru.rgasymov.moneymanager.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.rgasymov.moneymanager.domain.dto.XlsxParsingResult;
import ru.rgasymov.moneymanager.domain.entity.ExpenseType;
import ru.rgasymov.moneymanager.domain.entity.IncomeType;
import ru.rgasymov.moneymanager.exception.UploadFileException;
import ru.rgasymov.moneymanager.file.service.XlsxFileService;
import ru.rgasymov.moneymanager.repository.ExpenseTypeRepository;
import ru.rgasymov.moneymanager.repository.IncomeTypeRepository;
import ru.rgasymov.moneymanager.service.AccumulationService;
import ru.rgasymov.moneymanager.service.ExpenseService;
import ru.rgasymov.moneymanager.service.FileService;
import ru.rgasymov.moneymanager.service.IncomeService;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

  private final XlsxFileService xlsxFileService;

  private final UserService userService;

  private final IncomeTypeRepository incomeTypeRepository;

  private final ExpenseTypeRepository expenseTypeRepository;

  private final AccumulationService accumulationService;

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

    XlsxParsingResult result = xlsxFileService.parseFile(file);

    BigDecimal previousSavings = result.getPreviousSavings();
    LocalDate previousSavingsDate = result.getPreviousSavingsDate();
    if (previousSavings != null && previousSavingsDate != null) {
      if (previousSavings.signum() < 0) {
        accumulationService.decrease(previousSavings.abs(), previousSavingsDate);
      } else {
        accumulationService.increase(previousSavings, previousSavingsDate);
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
      String typeName = income.getIncomeType().getName();
      income.setIncomeType(incomeTypes.get(typeName));
      incomeService.create(income);
    }));

    result.getExpenses().forEach((expense -> {
      String typeName = expense.getExpenseType().getName();
      expense.setExpenseType(expenseTypes.get(typeName));
      expenseService.create(expense);
    }));
  }
}
