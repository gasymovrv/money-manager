package ru.rgasymov.moneymanager.service;

import ru.rgasymov.moneymanager.domain.dto.request.OperationRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.OperationResponseDto;
import ru.rgasymov.moneymanager.domain.entity.BaseOperation;

public interface BaseOperationService<T extends BaseOperation> {

  OperationResponseDto createFromDto(OperationRequestDto dto);

  void create(T entity);

  OperationResponseDto update(Long id, OperationRequestDto dto);

  void delete(Long id);
}
