package ru.rgasymov.moneymanager.service.impl;

import java.util.Set;
import javax.persistence.EntityNotFoundException;
import javax.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.domain.dto.request.IncomeTypeRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.IncomeTypeResponseDto;
import ru.rgasymov.moneymanager.domain.entity.IncomeType;
import ru.rgasymov.moneymanager.mapper.IncomeTypeMapper;
import ru.rgasymov.moneymanager.repository.IncomeRepository;
import ru.rgasymov.moneymanager.repository.IncomeTypeRepository;
import ru.rgasymov.moneymanager.service.IncomeTypeService;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@RequiredArgsConstructor
@Slf4j
public class IncomeTypeServiceImpl implements IncomeTypeService {

  private final IncomeTypeRepository incomeTypeRepository;

  private final IncomeRepository incomeRepository;

  private final UserService userService;

  private final IncomeTypeMapper incomeTypeMapper;

  @Transactional(readOnly = true)
  @Override
  public Set<IncomeTypeResponseDto> findAll() {
    var currentUser = userService.getCurrentUser();
    Set<IncomeType> result = incomeTypeRepository.findAllByUserId(currentUser.getId());
    return incomeTypeMapper.toDtos(result);
  }

  @Transactional
  @Override
  public IncomeTypeResponseDto create(IncomeTypeRequestDto dto) {
    var currentUser = userService.getCurrentUser();
    var currentUserId = currentUser.getId();

    if (incomeTypeRepository.existsByNameAndUserId(dto.getName(), currentUserId)) {
      throw new ValidationException(
          "Could not create the type because such name already exists");
    }

    var newIncomeType = IncomeType.builder()
        .name(dto.getName())
        .user(currentUser)
        .build();
    IncomeType saved = incomeTypeRepository.save(newIncomeType);
    return incomeTypeMapper.toDto(saved);
  }

  @Transactional
  @Override
  public IncomeTypeResponseDto update(Long id, IncomeTypeRequestDto dto) {
    var currentUser = userService.getCurrentUser();
    var currentUserId = currentUser.getId();

    if (incomeTypeRepository.existsByNameAndUserId(dto.getName(), currentUserId)) {
      throw new ValidationException(
          "Could not update the type because such name already exists");
    }

    IncomeType incomeType = incomeTypeRepository.findByIdAndUserId(id, currentUserId)
        .orElseThrow(() ->
            new EntityNotFoundException(
                String.format("Could not find income type with id = '%s' in the database",
                    id)));
    incomeType.setName(dto.getName());
    return incomeTypeMapper.toDto(incomeTypeRepository.save(incomeType));
  }

  @Transactional
  @Override
  public void delete(Long id) {
    var currentUser = userService.getCurrentUser();

    if (incomeRepository.existsByIncomeTypeId(id)) {
      throw new ValidationException(
          "Could not delete an income type while it is being referenced by any incomes");
    }
    incomeTypeRepository.deleteByIdAndUserId(id, currentUser.getId());
  }
}
