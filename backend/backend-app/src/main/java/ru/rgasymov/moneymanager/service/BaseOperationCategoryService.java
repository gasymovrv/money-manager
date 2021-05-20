package ru.rgasymov.moneymanager.service;

import java.util.Set;
import ru.rgasymov.moneymanager.domain.dto.request.OperationCategoryRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.OperationCategoryResponseDto;

public interface BaseOperationCategoryService {

  Set<OperationCategoryResponseDto> findAll();

  OperationCategoryResponseDto create(OperationCategoryRequestDto dto);

  OperationCategoryResponseDto update(Long id, OperationCategoryRequestDto dto);

  void delete(Long id);
}
