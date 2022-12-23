package ru.rgasymov.moneymanager.service.expense;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.rgasymov.moneymanager.domain.dto.request.OperationRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.OperationResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Expense;
import ru.rgasymov.moneymanager.domain.entity.ExpenseCategory;
import ru.rgasymov.moneymanager.domain.entity.Saving;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.ExpenseMapper;
import ru.rgasymov.moneymanager.repository.ExpenseCategoryRepository;
import ru.rgasymov.moneymanager.repository.ExpenseRepository;
import ru.rgasymov.moneymanager.service.BaseOperationService;
import ru.rgasymov.moneymanager.service.SavingService;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@Slf4j
public class ExpenseService
    extends BaseOperationService<Expense, ExpenseCategory> {

  private final ExpenseRepository expenseRepository;

  private final SavingService savingService;

  private final ExpenseMapper expenseMapper;

  public ExpenseService(
      ExpenseRepository expenseRepository,
      ExpenseCategoryRepository expenseCategoryRepository,
      ExpenseMapper expenseMapper,
      UserService userService,
      SavingService savingService) {
    super(expenseRepository, expenseCategoryRepository, expenseMapper, userService);
    this.expenseRepository = expenseRepository;
    this.savingService = savingService;
    this.expenseMapper = expenseMapper;
  }

  @Override
  protected OperationResponseDto saveNewOperation(Expense operation) {
    var value = operation.getValue();
    var date = operation.getDate();
    savingService.decrease(value, date);
    Saving saving = savingService.findByDate(date);
    operation.setSaving(saving);

    Expense saved = expenseRepository.save(operation);
    return expenseMapper.toDto(saved);
  }

  @Override
  protected Expense buildNewOperation(User currentUser,
                                      OperationRequestDto dto,
                                      ExpenseCategory category) {
    return Expense.builder()
        .date(dto.getDate())
        .value(dto.getValue())
        .description(dto.getDescription())
        .isPlanned(dto.getIsPlanned())
        .category(category)
        .account(currentUser.getCurrentAccount())
        .build();
  }

  @Override
  protected void updateSavings(BigDecimal value,
                               BigDecimal oldValue,
                               LocalDate date,
                               Expense operation) {
    BigDecimal subtract = value.subtract(oldValue);
    if (subtract.signum() > 0) {
      savingService.decrease(subtract, date);
    } else {
      savingService.increase(subtract.abs(), date);
    }
    Saving saving = savingService.findByDate(date);
    operation.setSaving(saving);
    operation.setValue(value);
  }

  @Override
  protected void deleteOperation(Expense expense, Long currentAccountId) {
    expenseRepository.deleteByIdAndAccountId(expense.getId(), currentAccountId);
    savingService.increase(expense.getValue(), expense.getDate());
    savingService.updateAfterDeletionOperation(expense.getDate());
  }

  @Override
  protected ExpenseCategory getOperationCategory(Expense operation) {
    return operation.getCategory();
  }

  @Override
  protected void setOperationCategory(Expense operation, ExpenseCategory operationCategory) {
    operation.setCategory(operationCategory);
  }
}
