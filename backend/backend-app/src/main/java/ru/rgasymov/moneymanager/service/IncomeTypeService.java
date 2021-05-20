package ru.rgasymov.moneymanager.service;

import java.util.Set;
import ru.rgasymov.moneymanager.domain.dto.request.IncomeTypeRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.IncomeTypeResponseDto;

public interface IncomeTypeService {

  Set<IncomeTypeResponseDto> findAll();

  IncomeTypeResponseDto create(IncomeTypeRequestDto dto);

  IncomeTypeResponseDto update(Long id, IncomeTypeRequestDto dto);

  void delete(Long id);
}
