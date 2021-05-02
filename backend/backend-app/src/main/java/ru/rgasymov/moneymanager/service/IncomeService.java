package ru.rgasymov.moneymanager.service;

import java.util.List;
import ru.rgasymov.moneymanager.domain.dto.request.IncomeRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.IncomeResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Income;

public interface IncomeService {

  List<IncomeResponseDto> findAll();

  IncomeResponseDto create(IncomeRequestDto dto);

  void create(Income income);

  IncomeResponseDto update(Long id, IncomeRequestDto dto);

  void delete(Long id);
}
