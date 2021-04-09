package ru.rgasymov.moneymanager.service.impl;

import java.util.List;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.domain.dto.request.IncomeRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.IncomeResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Income;
import ru.rgasymov.moneymanager.domain.entity.IncomeType;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.IncomeMapper;
import ru.rgasymov.moneymanager.repository.IncomeRepository;
import ru.rgasymov.moneymanager.repository.IncomeTypeRepository;
import ru.rgasymov.moneymanager.service.IncomeService;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@RequiredArgsConstructor
@Slf4j
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository incomeRepository;

    private final IncomeTypeRepository incomeTypeRepository;

    private final UserService userService;

    private final IncomeMapper incomeMapper;

    @Override
    public List<IncomeResponseDto> findAll() {
        return incomeMapper.toDtos(incomeRepository.findAll());
    }

    @Transactional
    @Override
    public IncomeResponseDto create(IncomeRequestDto dto) {
        User currentUser = userService.getCurrentUser();
        String currentUserId = currentUser.getId();
        Long incomeTypeId = dto.getIncomeTypeId();

        IncomeType incomeType = incomeTypeRepository.findByIdAndUserId(incomeTypeId, currentUserId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                String.format("Could not find income type with id = '%s' in the database",
                                        incomeTypeId)));

        Income newIncome = Income.builder()
                .date(dto.getDate())
                .value(dto.getValue())
                .description(dto.getDescription())
                .incomeType(incomeType)
                .user(currentUser)
                .build();

        Income saved = incomeRepository.save(newIncome);
        return incomeMapper.toDto(saved);
    }
}
