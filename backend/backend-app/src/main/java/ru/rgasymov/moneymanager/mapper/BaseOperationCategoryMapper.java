package ru.rgasymov.moneymanager.mapper;

import java.util.Set;
import ru.rgasymov.moneymanager.domain.dto.response.OperationCategoryResponseDto;
import ru.rgasymov.moneymanager.domain.entity.BaseOperationCategory;

public interface BaseOperationCategoryMapper<T extends BaseOperationCategory> {

  OperationCategoryResponseDto toDto(T entity);

  Set<OperationCategoryResponseDto> toDtos(Set<T> entities);
}
