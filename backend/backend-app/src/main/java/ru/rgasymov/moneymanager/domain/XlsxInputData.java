package ru.rgasymov.moneymanager.domain;

import java.util.List;
import ru.rgasymov.moneymanager.domain.dto.response.OperationCategoryResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.SavingResponseDto;

public record XlsxInputData(
    List<SavingResponseDto> savings,
    List<OperationCategoryResponseDto> incomeCategories,
    List<OperationCategoryResponseDto> expenseCategories) {
}
