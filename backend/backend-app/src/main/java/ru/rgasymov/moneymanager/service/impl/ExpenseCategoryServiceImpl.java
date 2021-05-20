package ru.rgasymov.moneymanager.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.rgasymov.moneymanager.domain.entity.Expense;
import ru.rgasymov.moneymanager.domain.entity.ExpenseCategory;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.ExpenseCategoryMapper;
import ru.rgasymov.moneymanager.repository.ExpenseCategoryRepository;
import ru.rgasymov.moneymanager.repository.ExpenseRepository;
import ru.rgasymov.moneymanager.service.ExpenseCategoryService;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@Slf4j
public class ExpenseCategoryServiceImpl
    extends AbstractOperationCategoryService<Expense, ExpenseCategory>
    implements ExpenseCategoryService {

  public ExpenseCategoryServiceImpl(
      ExpenseCategoryRepository expenseCategoryRepository,
      ExpenseRepository expenseRepository,
      ExpenseCategoryMapper expenseCategoryMapper,
      UserService userService) {
    super(expenseRepository, expenseCategoryRepository, expenseCategoryMapper, userService);
  }

  @Override
  protected ExpenseCategory buildNewOperationCategory(User currentUser, String name) {
    return ExpenseCategory.builder()
        .user(currentUser)
        .name(name)
        .build();
  }
}
