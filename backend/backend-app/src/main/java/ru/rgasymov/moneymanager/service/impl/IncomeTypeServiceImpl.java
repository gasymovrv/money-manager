package ru.rgasymov.moneymanager.service.impl;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import ru.rgasymov.moneymanager.domain.entity.Income;
import ru.rgasymov.moneymanager.domain.entity.IncomeType;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.IncomeTypeMapper;
import ru.rgasymov.moneymanager.repository.IncomeRepository;
import ru.rgasymov.moneymanager.repository.IncomeTypeRepository;
import ru.rgasymov.moneymanager.service.IncomeTypeService;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@Slf4j
public class IncomeTypeServiceImpl extends AbstractOperationTypeService<Income, IncomeType>
    implements IncomeTypeService {

  public IncomeTypeServiceImpl(
      IncomeTypeRepository incomeTypeRepository,
      IncomeRepository incomeRepository,
      IncomeTypeMapper incomeTypeMapper,
      UserService userService) {
    super(incomeRepository, incomeTypeRepository, incomeTypeMapper, userService);
  }

  @Override
  protected IncomeType buildNewOperationType(User currentUser, String name) {
    return IncomeType.builder()
        .user(currentUser)
        .name(name)
        .build();
  }
}
