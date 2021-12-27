package ru.rgasymov.moneymanager.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import ru.rgasymov.moneymanager.domain.dto.request.SavingCriteriaDto;
import ru.rgasymov.moneymanager.domain.dto.response.SavingSearchResultDto;
import ru.rgasymov.moneymanager.domain.entity.Saving;

public interface SavingService {

  SavingSearchResultDto search(SavingCriteriaDto criteria);

  Saving findByDate(LocalDate date);

  void increase(BigDecimal value, LocalDate date);

  void decrease(BigDecimal value, LocalDate date);

  void updateAfterDeletionOperation(LocalDate date);
}
