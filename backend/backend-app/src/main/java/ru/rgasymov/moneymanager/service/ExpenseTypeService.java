package ru.rgasymov.moneymanager.service;

import java.util.Set;
import ru.rgasymov.moneymanager.domain.dto.request.ExpenseTypeRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.ExpenseTypeResponseDto;

public interface ExpenseTypeService {

  Set<ExpenseTypeResponseDto> findAll();

  ExpenseTypeResponseDto create(ExpenseTypeRequestDto dto);

  ExpenseTypeResponseDto update(Long id, ExpenseTypeRequestDto dto);

  void delete(Long id);
}
