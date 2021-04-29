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
import ru.rgasymov.moneymanager.domain.dto.request.AccumulationCriteriaDto;
import ru.rgasymov.moneymanager.domain.dto.response.AccumulationResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.SearchResultDto;
import ru.rgasymov.moneymanager.domain.entity.Accumulation;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.AccumulationMapper;
import ru.rgasymov.moneymanager.repository.AccumulationRepository;
import ru.rgasymov.moneymanager.service.AccumulationService;
import ru.rgasymov.moneymanager.service.UserService;
import ru.rgasymov.moneymanager.specs.AccumulationSpec;

@Service
@RequiredArgsConstructor
public class AccumulationServiceImpl implements AccumulationService {

  interface RecalculateFunc {
    void recalculate(BigDecimal decrement,
                     LocalDate date,
                     String userId);
  }

  private final AccumulationRepository accumulationRepository;

  private final AccumulationMapper accumulationMapper;

  private final UserService userService;

  @Transactional(readOnly = true)
  @Override
  public SearchResultDto<AccumulationResponseDto> search(AccumulationCriteriaDto criteria) {
    Specification<Accumulation> criteriaAsSpec = applyCriteria(criteria);

    Page<Accumulation> page = accumulationRepository.findAll(criteriaAsSpec,
        PageRequest.of(
            criteria.getPageNum(),
            criteria.getPageSize(),
            Sort.by(criteria.getSortDirection(),
                criteria.getSortBy().getFieldName())));

    List<AccumulationResponseDto> result = accumulationMapper.toDtos(page.getContent());
    return SearchResultDto
        .<AccumulationResponseDto>builder()
        .result(result)
        .totalElements(page.getTotalElements())
        .build();
  }

  @Transactional(readOnly = true)
  @Override
  public Accumulation findByDate(LocalDate date) {
    User currentUser = userService.getCurrentUser();
    String currentUserId = currentUser.getId();
    return accumulationRepository.findByDateAndUserId(date, currentUserId).orElseThrow(() ->
        new EntityNotFoundException(
            String.format("Could not find accumulation by date = '%s' in the database",
                date)));
  }

  @Transactional
  @Override
  public void increase(BigDecimal value, LocalDate date) {
    recalculate(date, value, BigDecimal::add,
        accumulationRepository::increaseValueByDateGreaterThan);
  }

  @Transactional
  @Override
  public void decrease(BigDecimal value, LocalDate date) {
    recalculate(date, value, BigDecimal::subtract,
        accumulationRepository::decreaseValueByDateGreaterThan);
  }

  private void recalculate(LocalDate date,
                           BigDecimal value,
                           BiFunction<BigDecimal, BigDecimal, BigDecimal> setValueFunc,
                           RecalculateFunc recalculateOthersFunc) {
    User currentUser = userService.getCurrentUser();
    String currentUserId = currentUser.getId();

    //Find the accumulation by date and recalculate its value by the specified value
    Optional<Accumulation> accOpt = accumulationRepository.findByDateAndUserId(date, currentUserId);
    if (accOpt.isPresent()) {
      Accumulation acc = accOpt.get();
      acc.setValue(setValueFunc.apply(acc.getValue(), value));
      accumulationRepository.save(acc);
    } else {
      accOpt = accumulationRepository
          .findFirstByDateLessThanAndUserIdOrderByDateDesc(date, currentUserId);

      Accumulation newAccumulation = Accumulation.builder()
          .date(date)
          .user(currentUser)
          .build();

      if (accOpt.isPresent()) {
        newAccumulation.setValue(setValueFunc.apply(accOpt.get().getValue(), value));
      } else {
        newAccumulation.setValue(setValueFunc.apply(BigDecimal.ZERO, value));
      }
      accumulationRepository.save(newAccumulation);
    }

    //Recalculate the value of other accumulations by the specified value
    recalculateOthersFunc.recalculate(value, date, currentUserId);
  }

  private Specification<Accumulation> applyCriteria(AccumulationCriteriaDto criteria) {
    User currentUser = userService.getCurrentUser();
    String currentUserId = currentUser.getId();

    Specification<Accumulation> criteriaAsSpec = AccumulationSpec.userIdEq(currentUserId);

    LocalDate from = criteria.getFrom();
    LocalDate to = criteria.getTo();
    if (from != null || to != null) {
      criteriaAsSpec = criteriaAsSpec.and(AccumulationSpec.filterByDate(from, to));
    }

    return criteriaAsSpec;
  }
}
