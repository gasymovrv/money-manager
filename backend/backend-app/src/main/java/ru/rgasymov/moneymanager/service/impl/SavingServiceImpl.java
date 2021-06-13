package ru.rgasymov.moneymanager.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.function.BiFunction;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.domain.dto.request.SavingCriteriaDto;
import ru.rgasymov.moneymanager.domain.dto.response.SavingResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.SearchResultDto;
import ru.rgasymov.moneymanager.domain.entity.Saving;
import ru.rgasymov.moneymanager.domain.enums.Period;
import ru.rgasymov.moneymanager.mapper.SavingGroupMapper;
import ru.rgasymov.moneymanager.mapper.SavingMapper;
import ru.rgasymov.moneymanager.repository.SavingRepository;
import ru.rgasymov.moneymanager.service.SavingService;
import ru.rgasymov.moneymanager.service.UserService;
import ru.rgasymov.moneymanager.specs.SavingSpec;

@Service
@RequiredArgsConstructor
public class SavingServiceImpl implements SavingService {

  private final SavingRepository savingRepository;
  private final SavingMapper savingMapper;
  private final SavingGroupMapper savingGroupMapper;
  private final UserService userService;

  @Transactional(readOnly = true)
  @Override
  public SearchResultDto<SavingResponseDto> search(SavingCriteriaDto criteria) {
    Specification<Saving> criteriaAsSpec = applyCriteria(criteria);

    Page<Saving> page = savingRepository.findAll(criteriaAsSpec,
        PageRequest.of(
            criteria.getPageNum(),
            criteria.getPageSize(),
            Sort.by(criteria.getSortDirection(),
                criteria.getSortBy().getFieldName())));

    List<SavingResponseDto> result;
    if (criteria.getGroupBy() != Period.DAY) {
      result = savingGroupMapper.toGroupDtos(page.getContent(), criteria.getGroupBy());
    } else {
      result = savingMapper.toDtos(page.getContent());
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

  private Specification<Saving> applyCriteria(SavingCriteriaDto criteria) {
    var currentUser = userService.getCurrentUser();
    var currentAccountId = currentUser.getCurrentAccount().getId();

    Specification<Saving> criteriaAsSpec = SavingSpec.accountIdEq(currentAccountId);

    LocalDate from = criteria.getFrom();
    LocalDate to = criteria.getTo();
    if (from != null || to != null) {
      criteriaAsSpec = criteriaAsSpec.and(SavingSpec.filterByDate(from, to));
    }

    return criteriaAsSpec;
  }

  interface RecalculateFunc {
    void recalculate(BigDecimal decrement,
                     LocalDate date,
                     Long accountId);
  }
}
