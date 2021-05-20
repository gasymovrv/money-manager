package ru.rgasymov.moneymanager.service;

import java.util.Set;
import ru.rgasymov.moneymanager.domain.dto.request.OperationTypeRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.OperationTypeResponseDto;

public interface BaseOperationTypeService {

  Set<OperationTypeResponseDto> findAll();

  OperationTypeResponseDto create(OperationTypeRequestDto dto);

  OperationTypeResponseDto update(Long id, OperationTypeRequestDto dto);

  void delete(Long id);
}
