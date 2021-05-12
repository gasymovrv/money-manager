package ru.rgasymov.moneymanager.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.function.BiFunction;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
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

    List<SavingResponseDto> result = savingMapper.toDtos(page.getContent());
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
    var currentUserId = currentUser.getId();
    return savingRepository.findByDateAndUserId(date, currentUserId).orElseThrow(() ->
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

  private void recalculate(LocalDate date,
                           BigDecimal value,
                           BiFunction<BigDecimal, BigDecimal, BigDecimal> setValueFunc,
                           RecalculateFunc recalculateOthersFunc) {
    var currentUser = userService.getCurrentUser();
    var currentUserId = currentUser.getId();

    //Find the saving by date and recalculate its value by the specified value
    Optional<Saving> accOpt = savingRepository.findByDateAndUserId(date, currentUserId);
    if (accOpt.isPresent()) {
      Saving acc = accOpt.get();
      acc.setValue(setValueFunc.apply(acc.getValue(), value));
      savingRepository.save(acc);
    } else {
      accOpt = savingRepository
          .findFirstByDateLessThanAndUserIdOrderByDateDesc(date, currentUserId);

      var newSaving = Saving.builder()
          .date(date)
          .user(currentUser)
          .build();

      if (accOpt.isPresent()) {
        newSaving.setValue(setValueFunc.apply(accOpt.get().getValue(), value));
      } else {
        newSaving.setValue(setValueFunc.apply(BigDecimal.ZERO, value));
      }
      savingRepository.save(newSaving);
    }

    //Recalculate the value of other savings by the specified value
    recalculateOthersFunc.recalculate(value, date, currentUserId);
  }

  private Specification<Saving> applyCriteria(SavingCriteriaDto criteria) {
    var currentUser = userService.getCurrentUser();
    var currentUserId = currentUser.getId();

    Specification<Saving> criteriaAsSpec = SavingSpec.userIdEq(currentUserId);

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
                     String userId);
  }
}
