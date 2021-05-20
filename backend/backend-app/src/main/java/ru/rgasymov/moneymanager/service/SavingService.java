package ru.rgasymov.moneymanager.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import ru.rgasymov.moneymanager.domain.dto.request.SavingCriteriaDto;
import ru.rgasymov.moneymanager.domain.dto.response.SavingResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.SearchResultDto;
import ru.rgasymov.moneymanager.domain.entity.Saving;

public interface SavingService {

  SearchResultDto<SavingResponseDto> search(SavingCriteriaDto criteria);

  Saving findByDate(LocalDate date);

  void increase(BigDecimal value, LocalDate date);

  void decrease(BigDecimal value, LocalDate date);

  void updateAfterDeletionOperation(LocalDate date);
}
