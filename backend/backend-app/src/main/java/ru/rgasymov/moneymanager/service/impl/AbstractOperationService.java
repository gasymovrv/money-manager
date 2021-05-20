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
import ru.rgasymov.moneymanager.domain.entity.BaseOperationCategory;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.BaseOperationMapper;
import ru.rgasymov.moneymanager.repository.BaseOperationCategoryRepository;
import ru.rgasymov.moneymanager.repository.BaseOperationRepository;
import ru.rgasymov.moneymanager.service.BaseOperationService;
import ru.rgasymov.moneymanager.service.UserService;

@RequiredArgsConstructor
public abstract class AbstractOperationService<
    O extends BaseOperation,
    OT extends BaseOperationCategory>
    implements BaseOperationService<O> {

  private final BaseOperationRepository<O> operationRepository;

  private final BaseOperationCategoryRepository<OT> operationCategoryRepository;

  private final BaseOperationMapper<O> operationMapper;

  private final UserService userService;

  @Transactional
  @Override
  public OperationResponseDto createFromDto(OperationRequestDto dto) {
    var currentUser = userService.getCurrentUser();
    var currentUserId = currentUser.getId();
    var categoryId = dto.getCategoryId();
    var date = dto.getDate();
    var value = dto.getValue();

    OT category = operationCategoryRepository.findByIdAndUserId(categoryId, currentUserId)
        .orElseThrow(() ->
            new EntityNotFoundException(
                String.format("Could not find operation category with id = '%s' in the database",
                    categoryId)));
    O operation = buildNewOperation(currentUser, dto.getDescription(), category, date, value);

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
    var categoryId = dto.getCategoryId();
    var date = dto.getDate();
    var value = dto.getValue();

    O operation = operationRepository.findByIdAndUserId(id, currentUserId)
        .orElseThrow(() ->
            new EntityNotFoundException(
                String.format("Could not find operation with id = '%s' in the database",
                    id)));
    var oldCategoryId = getOperationCategory(operation).getId();
    var oldDate = operation.getDate();
    var oldValue = operation.getValue();

    if (isChanged(oldDate, date)) {
      deleteOperation(operation, currentUserId);
      return createFromDto(dto);
    }

    if (isChanged(oldCategoryId, categoryId)) {
      OT category = operationCategoryRepository.findByIdAndUserId(categoryId, currentUserId)
          .orElseThrow(() ->
              new EntityNotFoundException(
                  String.format("Could not find operation category with id = '%s' in the database",
                      categoryId)));
      setOperationCategory(operation, category);
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
                                         OT category,
                                         LocalDate date,
                                         BigDecimal value);

  protected abstract void updateSavings(BigDecimal value,
                                        BigDecimal oldValue,
                                        LocalDate date,
                                        O operation);

  protected abstract void deleteOperation(O operation, String currentUserId);

  protected abstract OT getOperationCategory(O operation);

  protected abstract void setOperationCategory(O operation, OT operationCategory);
}
