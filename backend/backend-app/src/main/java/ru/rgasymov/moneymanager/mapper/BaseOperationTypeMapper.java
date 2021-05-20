package ru.rgasymov.moneymanager.mapper;

import java.util.Set;
import ru.rgasymov.moneymanager.domain.dto.response.OperationTypeResponseDto;
import ru.rgasymov.moneymanager.domain.entity.BaseOperationType;

public interface BaseOperationTypeMapper<T extends BaseOperationType> {

  OperationTypeResponseDto toDto(T entity);

  Set<OperationTypeResponseDto> toDtos(Set<T> entities);
}
