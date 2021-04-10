package ru.rgasymov.moneymanager.service;

import java.util.List;
import ru.rgasymov.moneymanager.domain.dto.request.IncomeRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.IncomeResponseDto;

public interface IncomeService {

    List<IncomeResponseDto> findAll();

    IncomeResponseDto create(IncomeRequestDto dto);

    void delete(Long id);
}
