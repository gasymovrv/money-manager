package ru.rgasymov.moneymanager.service.income.impl;

import static ru.rgasymov.moneymanager.spec.IncomeCategorySpec.accountIdEq;

import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.constant.CacheNames;
import ru.rgasymov.moneymanager.domain.dto.response.OperationCategoryResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Income;
import ru.rgasymov.moneymanager.domain.entity.IncomeCategory;
import ru.rgasymov.moneymanager.domain.entity.IncomeCategory_;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.IncomeCategoryMapper;
import ru.rgasymov.moneymanager.repository.IncomeCategoryRepository;
import ru.rgasymov.moneymanager.repository.IncomeRepository;
import ru.rgasymov.moneymanager.service.AbstractOperationCategoryService;
import ru.rgasymov.moneymanager.service.UserService;
import ru.rgasymov.moneymanager.service.income.IncomeCategoryService;

@Service
@Slf4j
public class IncomeCategoryServiceImpl
    extends AbstractOperationCategoryService<Income, IncomeCategory>
    implements IncomeCategoryService {

  private final IncomeCategoryRepository incomeCategoryRepository;

  private final IncomeCategoryMapper incomeCategoryMapper;

  private final UserService userService;

  private final CacheManager cacheManager;

  public IncomeCategoryServiceImpl(
      IncomeCategoryRepository incomeCategoryRepository,
      IncomeRepository incomeRepository,
      IncomeCategoryMapper incomeCategoryMapper,
      UserService userService,
      CacheManager cacheManager) {
    super(incomeRepository, incomeCategoryRepository, incomeCategoryMapper, userService);
    this.incomeCategoryRepository = incomeCategoryRepository;
    this.incomeCategoryMapper = incomeCategoryMapper;
    this.userService = userService;
    this.cacheManager = cacheManager;
  }

  @Cacheable(cacheNames = CacheNames.INCOME_CATEGORIES)
  @Transactional(readOnly = true)
  @Override
  public List<OperationCategoryResponseDto> findAll() {
    var currentUser = userService.getCurrentUser();
    var currentAccountId = currentUser.getCurrentAccount().getId();
    List<IncomeCategory> result = findAll(currentAccountId);
    return incomeCategoryMapper.toDtos(result);
  }

  private List<IncomeCategory> findAll(Long accountId) {
    return incomeCategoryRepository.findAll(
        accountIdEq(accountId),
        Sort.by(Sort.Order.asc(IncomeCategory_.NAME).ignoreCase())
    );
  }

  @Cacheable(cacheNames = CacheNames.INCOME_CATEGORIES)
  @Transactional(readOnly = true)
  @Override
  public List<OperationCategoryResponseDto> findAllAndSetChecked(List<Long> ids) {
    var result = findAll();
    if (CollectionUtils.isNotEmpty(ids)) {
      result.forEach(category -> category.setChecked(ids.contains(category.getId())));
    }
    return result;
  }

  @Override
  protected IncomeCategory buildNewOperationCategory(User currentUser, String name) {
    return IncomeCategory.builder()
        .account(currentUser.getCurrentAccount())
        .name(name)
        .build();
  }

  @Override
  protected void clearCachedCategories() {
    Optional.ofNullable(cacheManager.getCache(CacheNames.INCOME_CATEGORIES))
        .ifPresent(Cache::clear);
  }
}
