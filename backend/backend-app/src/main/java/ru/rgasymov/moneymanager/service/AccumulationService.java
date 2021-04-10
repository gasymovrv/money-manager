package ru.rgasymov.moneymanager.service;

import java.time.LocalDate;
import java.util.List;
import ru.rgasymov.moneymanager.domain.dto.response.AccumulationResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Accumulation;
import ru.rgasymov.moneymanager.domain.entity.Expense;
import ru.rgasymov.moneymanager.domain.entity.Income;

public interface AccumulationService {

    List<AccumulationResponseDto> findAll();

    Accumulation findByDate(LocalDate date);

    void recalculate(Income income);

    void recalculate(Expense expense);
}
