package ru.rgasymov.moneymanager.domain;

import java.util.List;
import java.util.Set;
import ru.rgasymov.moneymanager.domain.dto.response.ExpenseTypeResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.IncomeTypeResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.SavingResponseDto;

public record XlsxInputData(
    List<SavingResponseDto> savings,
    Set<IncomeTypeResponseDto> incomeTypes,
    Set<ExpenseTypeResponseDto> expenseTypes) {
}
