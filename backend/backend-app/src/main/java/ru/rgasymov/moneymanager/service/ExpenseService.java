package ru.rgasymov.moneymanager.service;

import java.util.List;
import ru.rgasymov.moneymanager.domain.dto.request.ExpenseRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.ExpenseResponseDto;

public interface ExpenseService {

  List<ExpenseResponseDto> findAll();

  ExpenseResponseDto create(ExpenseRequestDto dto);

  ExpenseResponseDto update(Long id, ExpenseRequestDto dto);

  void delete(Long id);
}
