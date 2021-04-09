package ru.rgasymov.moneymanager.service.impl;

import java.util.List;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.domain.dto.request.ExpenseRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.ExpenseResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Expense;
import ru.rgasymov.moneymanager.domain.entity.ExpenseType;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.ExpenseMapper;
import ru.rgasymov.moneymanager.repository.ExpenseRepository;
import ru.rgasymov.moneymanager.repository.ExpenseTypeRepository;
import ru.rgasymov.moneymanager.service.ExpenseService;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;

    private final ExpenseTypeRepository expenseTypeRepository;

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
        Long expenseTypeId = dto.getExpenseTypeId();

        ExpenseType expenseType = expenseTypeRepository.findByIdAndUserId(expenseTypeId, currentUserId)
                .orElseThrow(() ->
                        new EntityNotFoundException(
                                String.format("Could not find expense type with id = '%s' in the database",
                                        expenseTypeId)));

        Expense newExpense = Expense.builder()
                .date(dto.getDate())
                .value(dto.getValue())
                .description(dto.getDescription())
                .expenseType(expenseType)
                .user(currentUser)
                .build();

        Expense saved = expenseRepository.save(newExpense);
        return expenseMapper.toDto(saved);
    }
}
