package ru.rgasymov.moneymanager.service.impl;

import java.util.Set;
import javax.persistence.EntityNotFoundException;
import javax.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.domain.dto.request.OperationCategoryRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.OperationCategoryResponseDto;
import ru.rgasymov.moneymanager.domain.entity.BaseOperation;
import ru.rgasymov.moneymanager.domain.entity.BaseOperationCategory;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.BaseOperationCategoryMapper;
import ru.rgasymov.moneymanager.repository.BaseOperationCategoryRepository;
import ru.rgasymov.moneymanager.repository.BaseOperationRepository;
import ru.rgasymov.moneymanager.service.BaseOperationCategoryService;
import ru.rgasymov.moneymanager.service.UserService;

@RequiredArgsConstructor
public abstract class AbstractOperationCategoryService<
    O extends BaseOperation,
    OT extends BaseOperationCategory> implements BaseOperationCategoryService {

  private final BaseOperationRepository<O> operationRepository;

  private final BaseOperationCategoryRepository<OT> operationCategoryRepository;

  private final BaseOperationCategoryMapper<OT> operationCategoryMapper;

  private final UserService userService;

  @Transactional(readOnly = true)
  @Override
  public Set<OperationCategoryResponseDto> findAll() {
    var currentUser = userService.getCurrentUser();
    Set<OT> result = operationCategoryRepository.findAllByUserId(currentUser.getId());
    return operationCategoryMapper.toDtos(result);
  }

  @Transactional
  @Override
  public OperationCategoryResponseDto create(OperationCategoryRequestDto dto) {
    var currentUser = userService.getCurrentUser();
    var currentUserId = currentUser.getId();

    if (operationCategoryRepository.existsByNameAndUserId(dto.getName(), currentUserId)) {
      throw new ValidationException(
          "Could not create operation category because such name already exists");
    }

    OT newOperationCategory = buildNewOperationCategory(currentUser, dto.getName());
    OT saved = operationCategoryRepository.save(newOperationCategory);
    return operationCategoryMapper.toDto(saved);
  }

  @Transactional
  @Override
  public OperationCategoryResponseDto update(Long id, OperationCategoryRequestDto dto) {
    var currentUser = userService.getCurrentUser();
    var currentUserId = currentUser.getId();

    if (operationCategoryRepository.existsByNameAndUserId(dto.getName(), currentUserId)) {
      throw new ValidationException(
          "Could not update operation category because such name already exists");
    }

    OT operationCategory = operationCategoryRepository.findByIdAndUserId(id, currentUserId)
        .orElseThrow(() ->
            new EntityNotFoundException(
                String.format("Could not find operation category with id = '%s' in the database",
                    id)));
    operationCategory.setName(dto.getName());
    OT saved = operationCategoryRepository.save(operationCategory);
    return operationCategoryMapper.toDto(saved);
  }

  @Transactional
  @Override
  public void delete(Long id) {
    var currentUser = userService.getCurrentUser();

    if (operationRepository.existsByCategoryId(id)) {
      throw new ValidationException(
          "Could not delete an operation category while it is being referenced by any expenses");
    }
    operationCategoryRepository.deleteByIdAndUserId(id, currentUser.getId());
  }

  protected abstract OT buildNewOperationCategory(User currentUser, String name);
}
