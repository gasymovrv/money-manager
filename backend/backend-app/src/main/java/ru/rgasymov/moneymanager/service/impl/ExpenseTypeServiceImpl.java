package ru.rgasymov.moneymanager.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.rgasymov.moneymanager.domain.entity.Expense;
import ru.rgasymov.moneymanager.domain.entity.ExpenseType;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.ExpenseTypeMapper;
import ru.rgasymov.moneymanager.repository.ExpenseRepository;
import ru.rgasymov.moneymanager.repository.ExpenseTypeRepository;
import ru.rgasymov.moneymanager.service.ExpenseTypeService;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@Slf4j
public class ExpenseTypeServiceImpl extends AbstractOperationTypeService<Expense, ExpenseType>
    implements ExpenseTypeService {

  public ExpenseTypeServiceImpl(
      ExpenseTypeRepository expenseTypeRepository,
      ExpenseRepository expenseRepository,
      ExpenseTypeMapper expenseTypeMapper,
      UserService userService) {
    super(expenseRepository, expenseTypeRepository, expenseTypeMapper, userService);
  }

  @Override
  protected ExpenseType buildNewOperationType(User currentUser, String name) {
    return ExpenseType.builder()
        .user(currentUser)
        .name(name)
        .build();
  }
}
