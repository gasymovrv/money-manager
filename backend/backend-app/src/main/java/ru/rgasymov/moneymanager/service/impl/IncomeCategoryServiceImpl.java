package ru.rgasymov.moneymanager.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.rgasymov.moneymanager.domain.entity.Income;
import ru.rgasymov.moneymanager.domain.entity.IncomeCategory;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.IncomeCategoryMapper;
import ru.rgasymov.moneymanager.repository.IncomeCategoryRepository;
import ru.rgasymov.moneymanager.repository.IncomeRepository;
import ru.rgasymov.moneymanager.service.IncomeCategoryService;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@Slf4j
public class IncomeCategoryServiceImpl
    extends AbstractOperationCategoryService<Income, IncomeCategory>
    implements IncomeCategoryService {

  public IncomeCategoryServiceImpl(
      IncomeCategoryRepository incomeCategoryRepository,
      IncomeRepository incomeRepository,
      IncomeCategoryMapper incomeCategoryMapper,
      UserService userService) {
    super(incomeRepository, incomeCategoryRepository, incomeCategoryMapper, userService);
  }

  @Override
  protected IncomeCategory buildNewOperationCategory(User currentUser, String name) {
    return IncomeCategory.builder()
        .user(currentUser)
        .name(name)
        .build();
  }
}
