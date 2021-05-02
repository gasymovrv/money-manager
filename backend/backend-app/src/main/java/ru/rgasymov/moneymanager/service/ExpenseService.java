package ru.rgasymov.moneymanager.service;

import java.util.List;
import ru.rgasymov.moneymanager.domain.dto.request.ExpenseRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.ExpenseResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Expense;

public interface ExpenseService {

  List<ExpenseResponseDto> findAll();

  ExpenseResponseDto create(ExpenseRequestDto dto);

  void create(Expense expense);

  ExpenseResponseDto update(Long id, ExpenseRequestDto dto);

  void delete(Long id);
}
