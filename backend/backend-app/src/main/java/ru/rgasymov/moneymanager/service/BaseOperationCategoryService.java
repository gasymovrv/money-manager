package ru.rgasymov.moneymanager.service;

import java.util.List;
import ru.rgasymov.moneymanager.domain.dto.request.OperationCategoryRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.OperationCategoryResponseDto;

public interface BaseOperationCategoryService {

  List<OperationCategoryResponseDto> findAll();

  List<OperationCategoryResponseDto> findAllAndSetChecked(List<Long> ids);

  OperationCategoryResponseDto create(OperationCategoryRequestDto dto);

  OperationCategoryResponseDto update(Long id, OperationCategoryRequestDto dto);

  void delete(Long id);
}
