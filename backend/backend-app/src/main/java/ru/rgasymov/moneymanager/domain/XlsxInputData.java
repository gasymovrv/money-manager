package ru.rgasymov.moneymanager.domain;

import java.util.List;
import java.util.Set;
import ru.rgasymov.moneymanager.domain.dto.response.OperationTypeResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.SavingResponseDto;

public record XlsxInputData(
    List<SavingResponseDto> savings,
    Set<OperationTypeResponseDto> incomeTypes,
    Set<OperationTypeResponseDto> expenseTypes) {
}
