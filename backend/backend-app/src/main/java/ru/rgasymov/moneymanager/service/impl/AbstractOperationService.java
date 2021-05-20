package ru.rgasymov.moneymanager.service.impl;

import static ru.rgasymov.moneymanager.util.ComparingUtils.isChanged;

import java.math.BigDecimal;
import java.time.LocalDate;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.Nullable;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.domain.dto.request.OperationRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.OperationResponseDto;
import ru.rgasymov.moneymanager.domain.entity.BaseOperation;
import ru.rgasymov.moneymanager.domain.entity.BaseOperationType;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.BaseOperationMapper;
import ru.rgasymov.moneymanager.repository.BaseOperationRepository;
import ru.rgasymov.moneymanager.repository.BaseOperationTypeRepository;
import ru.rgasymov.moneymanager.service.BaseOperationService;
import ru.rgasymov.moneymanager.service.UserService;

@RequiredArgsConstructor
public abstract class AbstractOperationService<
    O extends BaseOperation,
    OT extends BaseOperationType>
    implements BaseOperationService<O> {

  private final BaseOperationRepository<O> operationRepository;

  private final BaseOperationTypeRepository<OT> operationTypeRepository;

  private final BaseOperationMapper<O> operationMapper;

  private final UserService userService;

  @Transactional
  @Override
  public OperationResponseDto createFromDto(OperationRequestDto dto) {
    var currentUser = userService.getCurrentUser();
    var currentUserId = currentUser.getId();
    var typeId = dto.getTypeId();
    var date = dto.getDate();
    var value = dto.getValue();

    OT type = operationTypeRepository.findByIdAndUserId(typeId, currentUserId)
        .orElseThrow(() ->
            new EntityNotFoundException(
                String.format("Could not find operation type with id = '%s' in the database",
                    typeId)));
    O operation = buildNewOperation(currentUser, dto.getDescription(), type, date, value);

    return saveNewOperation(operation);
  }

  @Transactional
  @Override
  public void create(O operation) {
    saveNewOperation(operation);
  }

  @Transactional
  @Override
  public OperationResponseDto update(Long id, OperationRequestDto dto) {
    var currentUser = userService.getCurrentUser();
    var currentUserId = currentUser.getId();
    var typeId = dto.getTypeId();
    var date = dto.getDate();
    var value = dto.getValue();

    O operation = operationRepository.findByIdAndUserId(id, currentUserId)
        .orElseThrow(() ->
            new EntityNotFoundException(
                String.format("Could not find operation with id = '%s' in the database",
                    id)));
    var oldTypeId = getOperationType(operation).getId();
    var oldDate = operation.getDate();
    var oldValue = operation.getValue();

    if (isChanged(oldDate, date)) {
      deleteOperation(operation, currentUserId);
      return createFromDto(dto);
    }

    if (isChanged(oldTypeId, typeId)) {
      OT type = operationTypeRepository.findByIdAndUserId(typeId, currentUserId)
          .orElseThrow(() ->
              new EntityNotFoundException(
                  String.format("Could not find operation type with id = '%s' in the database",
                      typeId)));
      setOperationType(operation, type);
    }

    if (isChanged(oldValue, value)) {
      updateSavings(value, oldValue, date, operation);
    }

    operation.setDescription(dto.getDescription());
    O saved = operationRepository.save(operation);
    return operationMapper.toDto(saved);
  }

  @Transactional
  @Override
  public void delete(Long id) {
    var currentUser = userService.getCurrentUser();
    var currentUserId = currentUser.getId();

    O operation = operationRepository.findByIdAndUserId(id, currentUserId)
        .orElseThrow(() ->
            new EntityNotFoundException(
                String.format("Could not find operation with id = '%s' in the database",
                    id)));

    deleteOperation(operation, currentUserId);
  }

  protected abstract OperationResponseDto saveNewOperation(O operation);

  protected abstract O buildNewOperation(User currentUser,
                                         @Nullable String description,
                                         OT type,
                                         LocalDate date,
                                         BigDecimal value);

  protected abstract void updateSavings(BigDecimal value,
                                        BigDecimal oldValue,
                                        LocalDate date,
                                        O operation);

  protected abstract void deleteOperation(O operation, String currentUserId);

  protected abstract OT getOperationType(O operation);

  protected abstract void setOperationType(O operation, OT operType);
}
