package ru.rgasymov.moneymanager.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import ru.rgasymov.moneymanager.domain.dto.response.AccumulationResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Accumulation;

public interface AccumulationService {
    interface RecalculateFunc {
        void recalculate(BigDecimal decrement,
                         LocalDate date,
                         String userId);
    }

    List<AccumulationResponseDto> findAll();

    Accumulation findByDate(LocalDate date);

    void increase(BigDecimal value, LocalDate date);

    void decrease(BigDecimal value, LocalDate date);
}
