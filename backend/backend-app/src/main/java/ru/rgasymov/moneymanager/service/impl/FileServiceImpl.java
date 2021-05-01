package ru.rgasymov.moneymanager.service.impl;

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

  private final IncomeService incomeService;

  private final ExpenseService expenseService;

  @Transactional(propagation = Propagation.NEVER)
  @Override
  public void uploadXlsx(MultipartFile file) {
    var currentUser = userService.getCurrentUser();
    var currentUserId = currentUser.getId();

    XlsxParsingResult result = xlsxFileService.parseFile(file);

    if (incomeTypeRepository.existsByUserId(currentUserId)
        || expenseTypeRepository.existsByUserId(currentUserId)) {
      throw new UploadFileException(
          "# Failed to upload .xlsx file because the database is not empty");
    }

    Map<String, IncomeType> incomeTypes = incomeTypeRepository
        .saveAll(result.incomeTypes())
        .stream()
        .collect(Collectors.toMap(IncomeType::getName, incomeType -> incomeType));

    Map<String, ExpenseType> expenseTypes = expenseTypeRepository
        .saveAll(result.expenseTypes())
        .stream()
        .collect(Collectors.toMap(ExpenseType::getName, expenseType -> expenseType));

    result.incomes().forEach((income -> {
      String typeName = income.getIncomeType().getName();
      income.setIncomeType(incomeTypes.get(typeName));
      incomeService.create(income);
    }));

    result.expenses().forEach((expense -> {
      String typeName = expense.getExpenseType().getName();
      expense.setExpenseType(expenseTypes.get(typeName));
      expenseService.create(expense);
    }));
  }
}
