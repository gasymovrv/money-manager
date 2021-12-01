package ru.rgasymov.moneymanager.service.impl;

import static ru.rgasymov.moneymanager.spec.IncomeCategorySpec.accountIdEq;

import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
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
  private final IncomeCategoryRepository incomeCategoryRepository;

  public IncomeCategoryServiceImpl(
      IncomeCategoryRepository incomeCategoryRepository,
      IncomeRepository incomeRepository,
      IncomeCategoryMapper incomeCategoryMapper,
      UserService userService) {
    super(incomeRepository, incomeCategoryRepository, incomeCategoryMapper, userService);
    this.incomeCategoryRepository = incomeCategoryRepository;
  }

  @Override
  protected List<IncomeCategory> findAll(Long accountId) {
    return incomeCategoryRepository.findAll(
        accountIdEq(accountId),
        Sort.by(Sort.Order.asc("name").ignoreCase())
    );
  }

  @Override
  protected IncomeCategory buildNewOperationCategory(User currentUser, String name) {
    return IncomeCategory.builder()
        .account(currentUser.getCurrentAccount())
        .name(name)
        .build();
  }
}
