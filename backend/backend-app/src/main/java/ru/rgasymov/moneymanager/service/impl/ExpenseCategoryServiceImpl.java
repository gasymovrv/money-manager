package ru.rgasymov.moneymanager.service.impl;

import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import ru.rgasymov.moneymanager.domain.entity.Expense;
import ru.rgasymov.moneymanager.domain.entity.ExpenseCategory;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.ExpenseCategoryMapper;
import ru.rgasymov.moneymanager.repository.ExpenseCategoryRepository;
import ru.rgasymov.moneymanager.repository.ExpenseRepository;
import ru.rgasymov.moneymanager.service.ExpenseCategoryService;
import ru.rgasymov.moneymanager.service.UserService;
import ru.rgasymov.moneymanager.specs.ExpenseCategorySpec;

@Service
@Slf4j
public class ExpenseCategoryServiceImpl
    extends AbstractOperationCategoryService<Expense, ExpenseCategory>
    implements ExpenseCategoryService {
  private final ExpenseCategoryRepository expenseCategoryRepository;

  public ExpenseCategoryServiceImpl(
      ExpenseCategoryRepository expenseCategoryRepository,
      ExpenseRepository expenseRepository,
      ExpenseCategoryMapper expenseCategoryMapper,
      UserService userService) {
    super(expenseRepository, expenseCategoryRepository, expenseCategoryMapper, userService);
    this.expenseCategoryRepository = expenseCategoryRepository;
  }

  @Override
  protected List<ExpenseCategory> findAll(Long accountId) {
    return expenseCategoryRepository.findAll(
        ExpenseCategorySpec.accountIdEq(accountId),
        Sort.by(Sort.Order.asc("name").ignoreCase())
    );
  }

  @Override
  protected ExpenseCategory buildNewOperationCategory(User currentUser, String name) {
    return ExpenseCategory.builder()
        .account(currentUser.getCurrentAccount())
        .name(name)
        .build();
  }
}
