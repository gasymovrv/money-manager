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
import ru.rgasymov.moneymanager.domain.dto.request.ExpenseRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.ExpenseResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Accumulation;
import ru.rgasymov.moneymanager.domain.entity.Expense;
import ru.rgasymov.moneymanager.domain.entity.ExpenseType;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.ExpenseMapper;
import ru.rgasymov.moneymanager.repository.ExpenseRepository;
import ru.rgasymov.moneymanager.repository.ExpenseTypeRepository;
import ru.rgasymov.moneymanager.service.AccumulationService;
import ru.rgasymov.moneymanager.service.ExpenseService;
import ru.rgasymov.moneymanager.service.UserService;

import static ru.rgasymov.moneymanager.util.ComparingUtils.isChanged;
import static ru.rgasymov.moneymanager.util.ComparingUtils.valueLessThan;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;

    private final ExpenseTypeRepository expenseTypeRepository;

    private final AccumulationService accumulationService;

    private final UserService userService;

    private final ExpenseMapper expenseMapper;

    @Override
    public List<ExpenseResponseDto> findAll() {
        return expenseMapper.toDtos(expenseRepository.findAll());
    }

    @Transactional
    @Override
    public ExpenseResponseDto create(ExpenseRequestDto dto) {
        User currentUser = userService.getCurrentUser();
        String currentUserId = currentUser.getId();
        Long typeId = dto.getExpenseTypeId();
        LocalDate date = dto.getDate();
        BigDecimal value = dto.getValue();

        ExpenseType expenseType = expenseTypeRepository.findByIdAndUserId(typeId, currentUserId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                String.format("Could not find expense type with id = '%s' in the database",
                                        typeId)));

        Expense newExpense = Expense.builder()
                .date(date)
                .value(value)
                .description(dto.getDescription())
                .expenseType(expenseType)
                .user(currentUser)
                .build();

        accumulationService.decrease(value, date);
        Accumulation accumulation = accumulationService.findByDate(date);
        newExpense.setAccumulation(accumulation);

        Expense saved = expenseRepository.save(newExpense);
        return expenseMapper.toDto(saved);
    }

    @Transactional
    @Override
    public ExpenseResponseDto update(Long id, ExpenseRequestDto dto) {
        User currentUser = userService.getCurrentUser();
        String currentUserId = currentUser.getId();
        Long typeId = dto.getExpenseTypeId();
        LocalDate date = dto.getDate();
        BigDecimal value = dto.getValue();

        Expense expense = expenseRepository.findByIdAndUserId(id, currentUserId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                String.format("Could not find expense with id = '%s' in the database",
                                        id)));
        Long oldTypeId = expense.getExpenseType().getId();
        LocalDate oldDate = expense.getDate();
        BigDecimal oldValue = expense.getValue();

        if (isChanged(oldDate, date)) {
            throw new ValidationException("Expense date cannot be changed");
        }

        if (isChanged(oldTypeId, typeId)) {
            ExpenseType expenseType = expenseTypeRepository.findByIdAndUserId(typeId, currentUserId)
                    .orElseThrow(() ->
                            new EntityNotFoundException(
                                    String.format("Could not find expense type with id = '%s' in the database",
                                            typeId)));
            expense.setExpenseType(expenseType);
        }

        if (isChanged(oldValue, value)) {
            BigDecimal subtract = value.subtract(oldValue);
            if (valueLessThan(BigDecimal.ZERO, subtract)) {
                accumulationService.decrease(subtract, date);
            } else {
                accumulationService.increase(subtract.abs(), date);
            }
            Accumulation accumulation = accumulationService.findByDate(date);
            expense.setValue(value);
            expense.setAccumulation(accumulation);
        }

        expense.setDescription(dto.getDescription());
        Expense saved = expenseRepository.save(expense);
        return expenseMapper.toDto(saved);
    }

    @Transactional
    @Override
    public void delete(Long id) {
        User currentUser = userService.getCurrentUser();
        String currentUserId = currentUser.getId();

        Expense expense = expenseRepository.findByIdAndUserId(id, currentUserId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                String.format("Could not find expense with id = '%s' in the database",
                                        id)));

        accumulationService.increase(expense.getValue(), expense.getDate());
        expenseRepository.deleteByIdAndUserId(id, currentUserId);
    }
}
