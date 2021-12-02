package ru.rgasymov.moneymanager.service.impl;

import static ru.rgasymov.moneymanager.util.SpecUtils.andOptionally;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.function.BiFunction;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.domain.dto.request.SavingCriteriaDto;
import ru.rgasymov.moneymanager.domain.dto.response.OperationCategoryResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.SavingResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.SavingSearchResultDto;
import ru.rgasymov.moneymanager.domain.entity.Expense;
import ru.rgasymov.moneymanager.domain.entity.Income;
import ru.rgasymov.moneymanager.domain.entity.Saving;
import ru.rgasymov.moneymanager.domain.enums.Period;
import ru.rgasymov.moneymanager.mapper.SavingGroupMapper;
import ru.rgasymov.moneymanager.mapper.SavingMapper;
import ru.rgasymov.moneymanager.repository.ExpenseRepository;
import ru.rgasymov.moneymanager.repository.IncomeRepository;
import ru.rgasymov.moneymanager.repository.SavingRepository;
import ru.rgasymov.moneymanager.service.ExpenseCategoryService;
import ru.rgasymov.moneymanager.service.IncomeCategoryService;
import ru.rgasymov.moneymanager.service.SavingService;
import ru.rgasymov.moneymanager.service.UserService;
import ru.rgasymov.moneymanager.spec.BaseOperationSpec;
import ru.rgasymov.moneymanager.spec.ExpenseSpec;
import ru.rgasymov.moneymanager.spec.IncomeSpec;
import ru.rgasymov.moneymanager.spec.SavingSpec;

@Service
@RequiredArgsConstructor
public class SavingServiceImpl implements SavingService {

  private final SavingRepository savingRepository;
  private final IncomeRepository incomeRepository;
  private final ExpenseRepository expenseRepository;
  private final SavingMapper savingMapper;
  private final SavingGroupMapper savingGroupMapper;
  private final UserService userService;
  private final IncomeCategoryService incomeCategoryService;
  private final ExpenseCategoryService expenseCategoryService;

  @Transactional(readOnly = true)
  @Override
  public SavingSearchResultDto search(SavingCriteriaDto criteria) {
    var incCategories =
        incomeCategoryService.findAllAndSetChecked(criteria.getIncomeCategoryIds());
    var expCategories =
        expenseCategoryService.findAllAndSetChecked(criteria.getExpenseCategoryIds());

    Specification<Saving> criteriaAsSpec =
        applySavingCriteria(criteria, incCategories, expCategories);

    Page<Saving> page = savingRepository.findAll(criteriaAsSpec,
        PageRequest.of(
            criteria.getPageNum(),
            criteria.getPageSize(),
            Sort.by(criteria.getSortDirection(),
                criteria.getSortBy().getFieldName())));
    var savings = page.getContent();

    // Saving search filters only by savings and returns all operations of each found saving,
    // even they don't match with the search text.
    // Find operations by saving ids and the criteria and set explicitly
    fillOperationsExplicitlyForSearchByText(savings, criteria);

    List<SavingResponseDto> result;
    if (criteria.getGroupBy() != Period.DAY) {
      result = savingGroupMapper.toGroupDtos(savings, criteria.getGroupBy());
    } else {
      result = savingMapper.toDtos(savings);
    }

    return SavingSearchResultDto
        .builder()
        .result(result)
        .totalElements(page.getTotalElements())
        .incomeCategories(incCategories)
        .expenseCategories(expCategories)
        .build();
  }

  @Transactional(readOnly = true)
  @Override
  public Saving findByDate(LocalDate date) {
    var currentUser = userService.getCurrentUser();
    var currentAccountId = currentUser.getCurrentAccount().getId();
    return savingRepository.findByDateAndAccountId(date, currentAccountId).orElseThrow(() ->
        new EntityNotFoundException(
            String.format("Could not find saving by date = '%s' in the database",
                date)));
  }

  @Transactional
  @Override
  public void increase(BigDecimal value, LocalDate date) {
    recalculate(date, value, BigDecimal::add,
        savingRepository::increaseValueByDateGreaterThan);
  }

  @Transactional
  @Override
  public void decrease(BigDecimal value, LocalDate date) {
    recalculate(date, value, BigDecimal::subtract,
        savingRepository::decreaseValueByDateGreaterThan);
  }

  @Transactional
  @Override
  public void updateAfterDeletionOperation(LocalDate date) {
    var currentUser = userService.getCurrentUser();
    var currentAccountId = currentUser.getCurrentAccount().getId();

    savingRepository.findByDateAndAccountId(date, currentAccountId).ifPresent(saving -> {
      if (CollectionUtils.isEmpty(saving.getIncomes())
          && CollectionUtils.isEmpty(saving.getExpenses())) {
        savingRepository.delete(saving);
      }
    });
  }

  private void recalculate(LocalDate date,
                           BigDecimal value,
                           BiFunction<BigDecimal, BigDecimal, BigDecimal> setValueFunc,
                           RecalculateFunc recalculateOthersFunc) {
    var currentUser = userService.getCurrentUser();
    var currentAccountId = currentUser.getCurrentAccount().getId();

    //Find the saving by date and recalculate its value by the specified value
    Optional<Saving> savingOpt = savingRepository.findByDateAndAccountId(date, currentAccountId);
    if (savingOpt.isPresent()) {
      Saving saving = savingOpt.get();
      saving.setValue(setValueFunc.apply(saving.getValue(), value));
      savingRepository.save(saving);
    } else {
      savingOpt = savingRepository
          .findFirstByDateLessThanAndAccountIdOrderByDateDesc(date, currentAccountId);

      var newSaving = Saving.builder()
          .date(date)
          .account(currentUser.getCurrentAccount())
          .build();

      if (savingOpt.isPresent()) {
        newSaving.setValue(setValueFunc.apply(savingOpt.get().getValue(), value));
      } else {
        newSaving.setValue(setValueFunc.apply(BigDecimal.ZERO, value));
      }
      savingRepository.save(newSaving);
    }

    //Recalculate the value of other savings by the specified value
    recalculateOthersFunc.recalculate(value, date, currentAccountId);
  }

  private void fillOperationsExplicitlyForSearchByText(List<Saving> savings,
                                                       SavingCriteriaDto criteriaDto) {
    if (StringUtils.isBlank(criteriaDto.getSearchText())) {
      return;
    }

    var savingIds = savings.stream().map(Saving::getId).toList();
    var incomeMap = new HashMap<Long, List<Income>>();
    var expenseMap = new HashMap<Long, List<Expense>>();

    incomeRepository.findAll(applyIncomeCriteria(savingIds, criteriaDto))
        .forEach(inc -> {
          ArrayList<Income> value = new ArrayList<>();
          value.add(inc);
          incomeMap.merge(inc.getSaving().getId(), value,
              (oldValue, newValue) -> {
                oldValue.addAll(newValue);
                return oldValue;
              });
        });

    expenseRepository.findAll(applyExpenseCriteria(savingIds, criteriaDto))
        .forEach(exp -> {
          ArrayList<Expense> value = new ArrayList<>();
          value.add(exp);
          expenseMap.merge(exp.getSaving().getId(), value,
              (oldValue, newValue) -> {
                oldValue.addAll(newValue);
                return oldValue;
              });
        });

    savings.forEach(saving -> {
      saving.setIncomes(Optional
          .ofNullable(incomeMap.get(saving.getId()))
          .orElse(List.of()));
      saving.setExpenses(Optional
          .ofNullable(expenseMap.get(saving.getId()))
          .orElse(List.of()));
    });
  }

  private Specification<Saving> applySavingCriteria(
      SavingCriteriaDto criteria,
      List<OperationCategoryResponseDto> incCategories,
      List<OperationCategoryResponseDto> expCategories) {
    var currentUser = userService.getCurrentUser();
    var currentAccountId = currentUser.getCurrentAccount().getId();

    Specification<Saving> criteriaAsSpec = SavingSpec.accountIdEq(currentAccountId);

    if (CollectionUtils.isNotEmpty(criteria.getIncomeCategoryIds())
        || CollectionUtils.isNotEmpty(criteria.getExpenseCategoryIds())
        || StringUtils.isNotBlank(criteria.getSearchText())) {

      var selectedIncCategoryIds = incCategories.stream()
          .filter(OperationCategoryResponseDto::isChecked)
          .map(OperationCategoryResponseDto::getId)
          .toList();

      var selectedExpCategoryIds = expCategories.stream()
          .filter(OperationCategoryResponseDto::isChecked)
          .map(OperationCategoryResponseDto::getId)
          .toList();

      criteriaAsSpec = criteriaAsSpec.and(SavingSpec.filterBySearchTextAndCategoryIds(
          selectedIncCategoryIds,
          selectedExpCategoryIds,
          criteria.getSearchText())
      );
    }

    LocalDate from = criteria.getFrom();
    LocalDate to = criteria.getTo();
    if (from != null || to != null) {
      criteriaAsSpec = criteriaAsSpec.and(SavingSpec.filterByDate(from, to));
    }

    return criteriaAsSpec;
  }

  private Specification<Income> applyIncomeCriteria(List<Long> savingIds,
                                                    SavingCriteriaDto criteriaDto) {
    Specification<Income> incomeSpec = BaseOperationSpec.savingIdIn(savingIds);
    incomeSpec =
        andOptionally(incomeSpec, IncomeSpec::matchBySearchText, criteriaDto.getSearchText());
    return andOptionally(incomeSpec, IncomeSpec::categoryIdIn, criteriaDto.getIncomeCategoryIds());
  }

  private Specification<Expense> applyExpenseCriteria(List<Long> savingIds,
                                                      SavingCriteriaDto criteriaDto) {
    Specification<Expense> expenseSpec = BaseOperationSpec.savingIdIn(savingIds);
    expenseSpec =
        andOptionally(expenseSpec, ExpenseSpec::matchBySearchText, criteriaDto.getSearchText());
    return andOptionally(expenseSpec, ExpenseSpec::categoryIdIn,
        criteriaDto.getExpenseCategoryIds());
  }

  interface RecalculateFunc {
    void recalculate(BigDecimal decrement,
                     LocalDate date,
                     Long accountId);
  }
}
