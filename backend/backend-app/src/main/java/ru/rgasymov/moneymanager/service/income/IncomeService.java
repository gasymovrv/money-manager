package ru.rgasymov.moneymanager.service.income;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.rgasymov.moneymanager.domain.dto.request.OperationRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.OperationResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Income;
import ru.rgasymov.moneymanager.domain.entity.IncomeCategory;
import ru.rgasymov.moneymanager.domain.entity.Saving;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.IncomeMapper;
import ru.rgasymov.moneymanager.repository.IncomeCategoryRepository;
import ru.rgasymov.moneymanager.repository.IncomeRepository;
import ru.rgasymov.moneymanager.service.BaseOperationService;
import ru.rgasymov.moneymanager.service.SavingService;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@Slf4j
public class IncomeService
    extends BaseOperationService<Income, IncomeCategory> {

  private final IncomeRepository incomeRepository;

  private final SavingService savingService;

  private final IncomeMapper incomeMapper;

  public IncomeService(
      IncomeRepository incomeRepository,
      IncomeCategoryRepository incomeCategoryRepository,
      IncomeMapper incomeMapper,
      UserService userService,
      SavingService savingService) {
    super(incomeRepository, incomeCategoryRepository, incomeMapper, userService);
    this.incomeRepository = incomeRepository;
    this.savingService = savingService;
    this.incomeMapper = incomeMapper;
  }

  @Override
  protected OperationResponseDto saveNewOperation(Income operation) {
    var value = operation.getValue();
    var date = operation.getDate();
    savingService.increase(value, date);
    Saving saving = savingService.findByDate(date);
    operation.setSaving(saving);

    Income saved = incomeRepository.save(operation);
    return incomeMapper.toDto(saved);
  }

  @Override
  protected Income buildNewOperation(User currentUser,
                                     OperationRequestDto dto,
                                     IncomeCategory category) {
    return Income.builder()
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
                               Income operation) {
    BigDecimal subtract = value.subtract(oldValue);
    if (subtract.signum() > 0) {
      savingService.increase(subtract, date);
    } else {
      savingService.decrease(subtract.abs(), date);
    }
    Saving saving = savingService.findByDate(date);
    operation.setSaving(saving);
    operation.setValue(value);
  }

  @Override
  protected void deleteOperation(Income income, Long currentAccountId) {
    incomeRepository.deleteByIdAndAccountId(income.getId(), currentAccountId);
    savingService.decrease(income.getValue(), income.getDate());
    savingService.updateAfterDeletionOperation(income.getDate());
  }

  @Override
  protected IncomeCategory getOperationCategory(Income operation) {
    return operation.getCategory();
  }

  @Override
  protected void setOperationCategory(Income operation, IncomeCategory incomeCategory) {
    operation.setCategory(incomeCategory);
  }
}
