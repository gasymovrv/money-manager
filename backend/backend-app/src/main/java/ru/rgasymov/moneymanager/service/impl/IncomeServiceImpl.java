package ru.rgasymov.moneymanager.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.rgasymov.moneymanager.domain.dto.response.OperationResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Income;
import ru.rgasymov.moneymanager.domain.entity.IncomeType;
import ru.rgasymov.moneymanager.domain.entity.Saving;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.IncomeMapper;
import ru.rgasymov.moneymanager.repository.IncomeRepository;
import ru.rgasymov.moneymanager.repository.IncomeTypeRepository;
import ru.rgasymov.moneymanager.service.IncomeService;
import ru.rgasymov.moneymanager.service.SavingService;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@Slf4j
public class IncomeServiceImpl
    extends AbstractOperationService<Income, IncomeType>
    implements IncomeService {

  private final IncomeRepository incomeRepository;

  private final SavingService savingService;

  private final IncomeMapper incomeMapper;

  public IncomeServiceImpl(
      IncomeRepository incomeRepository,
      IncomeTypeRepository incomeTypeRepository,
      IncomeMapper incomeMapper,
      UserService userService,
      SavingService savingService) {
    super(incomeRepository, incomeTypeRepository, incomeMapper, userService);
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
                                     String description,
                                     IncomeType type,
                                     LocalDate date,
                                     BigDecimal value) {
    return Income.builder()
        .date(date)
        .value(value)
        .description(description)
        .type(type)
        .user(currentUser)
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
  protected void deleteOperation(Income income, String currentUserId) {
    savingService.decrease(income.getValue(), income.getDate());
    incomeRepository.deleteByIdAndUserId(income.getId(), currentUserId);
  }

  @Override
  protected IncomeType getOperationType(Income operation) {
    return operation.getType();
  }

  @Override
  protected void setOperationType(Income operation, IncomeType incomeType) {
    operation.setType(incomeType);
  }
}
