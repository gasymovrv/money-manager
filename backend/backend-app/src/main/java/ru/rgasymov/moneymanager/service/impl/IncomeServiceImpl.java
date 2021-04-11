package ru.rgasymov.moneymanager.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import javax.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.domain.dto.request.IncomeRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.IncomeResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Accumulation;
import ru.rgasymov.moneymanager.domain.entity.Income;
import ru.rgasymov.moneymanager.domain.entity.IncomeType;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.IncomeMapper;
import ru.rgasymov.moneymanager.repository.IncomeRepository;
import ru.rgasymov.moneymanager.repository.IncomeTypeRepository;
import ru.rgasymov.moneymanager.service.AccumulationService;
import ru.rgasymov.moneymanager.service.IncomeService;
import ru.rgasymov.moneymanager.service.UserService;

import static ru.rgasymov.moneymanager.util.ComparingUtils.isChanged;
import static ru.rgasymov.moneymanager.util.ComparingUtils.valueLessThan;

@Service
@RequiredArgsConstructor
@Slf4j
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository incomeRepository;

    private final IncomeTypeRepository incomeTypeRepository;

    private final AccumulationService accumulationService;

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
        LocalDate date = dto.getDate();
        BigDecimal value = dto.getValue();

        IncomeType incomeType = incomeTypeRepository.findByIdAndUserId(incomeTypeId, currentUserId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                String.format("Could not find income type with id = '%s' in the database",
                                        incomeTypeId)));

        Income newIncome = Income.builder()
                .date(date)
                .value(value)
                .description(dto.getDescription())
                .incomeType(incomeType)
                .user(currentUser)
                .build();

        accumulationService.increase(value, date);
        Accumulation accumulation = accumulationService.findByDate(date);
        newIncome.setAccumulation(accumulation);

        Income saved = incomeRepository.save(newIncome);
        return incomeMapper.toDto(saved);
    }

    @Transactional
    @Override
    public IncomeResponseDto update(Long id, IncomeRequestDto dto) {
        User currentUser = userService.getCurrentUser();
        String currentUserId = currentUser.getId();
        Long typeId = dto.getIncomeTypeId();
        LocalDate date = dto.getDate();
        BigDecimal value = dto.getValue();

        Income income = incomeRepository.findByIdAndUserId(id, currentUserId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                String.format("Could not find income with id = '%s' in the database",
                                        id)));
        Long oldTypeId = income.getIncomeType().getId();
        LocalDate oldDate = income.getDate();
        BigDecimal oldValue = income.getValue();

        if (isChanged(oldDate, date)) {
            throw new ValidationException("Income date cannot be changed");
        }

        if (isChanged(oldTypeId, typeId)) {
            IncomeType incomeType = incomeTypeRepository.findByIdAndUserId(typeId, currentUserId)
                    .orElseThrow(() ->
                            new EntityNotFoundException(
                                    String.format("Could not find income type with id = '%s' in the database",
                                            typeId)));
            income.setIncomeType(incomeType);
        }

        if (isChanged(oldValue, value)) {
            BigDecimal subtract = value.subtract(oldValue);
            if (valueLessThan(BigDecimal.ZERO, subtract)) {
                accumulationService.increase(subtract, date);
            } else {
                accumulationService.decrease(subtract.abs(), date);
            }
            Accumulation accumulation = accumulationService.findByDate(date);
            income.setValue(value);
            income.setAccumulation(accumulation);
        }

        income.setDescription(dto.getDescription());
        Income saved = incomeRepository.save(income);
        return incomeMapper.toDto(saved);
    }

    @Transactional
    @Override
    public void delete(Long id) {
        User currentUser = userService.getCurrentUser();
        String currentUserId = currentUser.getId();

        Income income = incomeRepository.findByIdAndUserId(id, currentUserId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                String.format("Could not find income with id = '%s' in the database",
                                        id)));

        accumulationService.decrease(income.getValue(), income.getDate());
        incomeRepository.deleteByIdAndUserId(id, currentUserId);
    }
}
