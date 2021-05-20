package ru.rgasymov.moneymanager.service.impl;

import java.util.Set;
import javax.persistence.EntityNotFoundException;
import javax.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.domain.dto.request.OperationTypeRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.OperationTypeResponseDto;
import ru.rgasymov.moneymanager.domain.entity.BaseOperation;
import ru.rgasymov.moneymanager.domain.entity.BaseOperationType;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.BaseOperationTypeMapper;
import ru.rgasymov.moneymanager.repository.BaseOperationRepository;
import ru.rgasymov.moneymanager.repository.BaseOperationTypeRepository;
import ru.rgasymov.moneymanager.service.BaseOperationTypeService;
import ru.rgasymov.moneymanager.service.UserService;

@RequiredArgsConstructor
public abstract class AbstractOperationTypeService<
    O extends BaseOperation,
    OT extends BaseOperationType> implements BaseOperationTypeService {

  private final BaseOperationRepository<O> operationRepository;

  private final BaseOperationTypeRepository<OT> operationTypeRepository;

  private final BaseOperationTypeMapper<OT> operationTypeMapper;

  private final UserService userService;

  @Transactional(readOnly = true)
  @Override
  public Set<OperationTypeResponseDto> findAll() {
    var currentUser = userService.getCurrentUser();
    Set<OT> result = operationTypeRepository.findAllByUserId(currentUser.getId());
    return operationTypeMapper.toDtos(result);
  }

  @Transactional
  @Override
  public OperationTypeResponseDto create(OperationTypeRequestDto dto) {
    var currentUser = userService.getCurrentUser();
    var currentUserId = currentUser.getId();

    if (operationTypeRepository.existsByNameAndUserId(dto.getName(), currentUserId)) {
      throw new ValidationException(
          "Could not create operation type because such name already exists");
    }

    OT newOperationType = buildNewOperationType(currentUser, dto.getName());
    OT saved = operationTypeRepository.save(newOperationType);
    return operationTypeMapper.toDto(saved);
  }

  @Transactional
  @Override
  public OperationTypeResponseDto update(Long id, OperationTypeRequestDto dto) {
    var currentUser = userService.getCurrentUser();
    var currentUserId = currentUser.getId();

    if (operationTypeRepository.existsByNameAndUserId(dto.getName(), currentUserId)) {
      throw new ValidationException(
          "Could not update operation type because such name already exists");
    }

    OT operationType = operationTypeRepository.findByIdAndUserId(id, currentUserId)
        .orElseThrow(() ->
            new EntityNotFoundException(
                String.format("Could not find operation type with id = '%s' in the database",
                    id)));
    operationType.setName(dto.getName());
    OT saved = operationTypeRepository.save(operationType);
    return operationTypeMapper.toDto(saved);
  }

  @Transactional
  @Override
  public void delete(Long id) {
    var currentUser = userService.getCurrentUser();

    if (operationRepository.existsByTypeId(id)) {
      throw new ValidationException(
          "Could not delete an operation type while it is being referenced by any expenses");
    }
    operationTypeRepository.deleteByIdAndUserId(id, currentUser.getId());
  }

  protected abstract OT buildNewOperationType(User currentUser, String name);
}
