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
import ru.rgasymov.moneymanager.domain.dto.response.SavingResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.SearchResultDto;
import ru.rgasymov.moneymanager.domain.entity.BaseOperation;
import ru.rgasymov.moneymanager.domain.entity.Expense;
import ru.rgasymov.moneymanager.domain.entity.Income;
import ru.rgasymov.moneymanager.domain.entity.Saving;
import ru.rgasymov.moneymanager.domain.enums.Period;
import ru.rgasymov.moneymanager.mapper.SavingGroupMapper;
import ru.rgasymov.moneymanager.mapper.SavingMapper;
import ru.rgasymov.moneymanager.repository.ExpenseRepository;
import ru.rgasymov.moneymanager.repository.IncomeRepository;
import ru.rgasymov.moneymanager.repository.SavingRepository;
import ru.rgasymov.moneymanager.service.SavingService;
import ru.rgasymov.moneymanager.service.UserService;
import ru.rgasymov.moneymanager.specs.BaseOperationSpec;
import ru.rgasymov.moneymanager.specs.SavingSpec;

@Service
@RequiredArgsConstructor
public class SavingServiceImpl implements SavingService {

  private final SavingRepository savingRepository;
  private final IncomeRepository incomeRepository;
  private final ExpenseRepository expenseRepository;
  private final SavingMapper savingMapper;
  private final SavingGroupMapper savingGroupMapper;
  private final UserService userService;

  @Transactional(readOnly = true)
  @Override
  public SearchResultDto<SavingResponseDto> search(SavingCriteriaDto criteria) {
    Specification<Saving> criteriaAsSpec = applySavingCriteria(criteria);

    Page<Saving> page = savingRepository.findAll(criteriaAsSpec,
        PageRequest.of(
            criteria.getPageNum(),
            criteria.getPageSize(),
            Sort.by(criteria.getSortDirection(),
                criteria.getSortBy().getFieldName())));
    var content = page.getContent();
    replaceUnnecessaryOperations(content, criteria.getSearchText());

    List<SavingResponseDto> result;
    if (criteria.getGroupBy() != Period.DAY) {
      result = savingGroupMapper.toGroupDtos(content, criteria.getGroupBy());
    } else {
      result = savingMapper.toDtos(content);
    }

    return SearchResultDto
        .<SavingResponseDto>builder()
        .result(result)
        .totalElements(page.getTotalElements())
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

  /**
   * Replaces incomes and expenses in all savings to remove unnecessary results.
   *
   * @param content    savings
   * @param searchText the search text
   */
  private void replaceUnnecessaryOperations(List<Saving> content,
                                            String searchText) {
    if (StringUtils.isBlank(searchText)) {
      return;
    }
    var savingIds = content.stream().map(Saving::getId).toList();
    var incomeMap = new HashMap<Long, List<Income>>();
    var expenseMap = new HashMap<Long, List<Expense>>();

    incomeRepository.findAll(
            applyOperationCriteria(savingIds, searchText))
        .forEach(inc -> {
          ArrayList<Income> value = new ArrayList<>();
          value.add(inc);
          incomeMap.merge(inc.getSaving().getId(), value,
              (oldValue, newValue) -> {
                oldValue.addAll(newValue);
                return oldValue;
              });
        });

    expenseRepository.findAll(
            applyOperationCriteria(savingIds, searchText))
        .forEach(exp -> {
          ArrayList<Expense> value = new ArrayList<>();
          value.add(exp);
          expenseMap.merge(exp.getSaving().getId(), value,
              (oldValue, newValue) -> {
                oldValue.addAll(newValue);
                return oldValue;
              });
        });

    content.forEach(saving -> {
      saving.setIncomes(Optional
          .ofNullable(incomeMap.get(saving.getId()))
          .orElse(List.of()));
      saving.setExpenses(Optional
          .ofNullable(expenseMap.get(saving.getId()))
          .orElse(List.of()));
    });
  }

  private Specification<Saving> applySavingCriteria(SavingCriteriaDto criteria) {
    var currentUser = userService.getCurrentUser();
    var currentAccountId = currentUser.getCurrentAccount().getId();

    Specification<Saving> criteriaAsSpec = SavingSpec.accountIdEq(currentAccountId);
    criteriaAsSpec = andOptionally(
        criteriaAsSpec,
        SavingSpec::matchBySearchText,
        criteria.getSearchText());

    LocalDate from = criteria.getFrom();
    LocalDate to = criteria.getTo();
    if (from != null || to != null) {
      criteriaAsSpec = criteriaAsSpec.and(SavingSpec.filterByDate(from, to));
    }

    return criteriaAsSpec;
  }

  private <R extends BaseOperation> Specification<R> applyOperationCriteria(List<Long> savingIds,
                                                                            String searchText) {
    Specification<R> spec = BaseOperationSpec.savingIdIn(savingIds);
    spec = andOptionally(spec, BaseOperationSpec::matchBySearchText, searchText);
    return spec;
  }

  interface RecalculateFunc {
    void recalculate(BigDecimal decrement,
                     LocalDate date,
                     Long accountId);
  }
}
