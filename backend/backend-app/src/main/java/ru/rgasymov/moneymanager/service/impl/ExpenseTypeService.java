package ru.rgasymov.moneymanager.service.impl;

import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.domain.dto.request.ExpenseTypeRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.ExpenseTypeResponseDto;
import ru.rgasymov.moneymanager.domain.entity.ExpenseType;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.ExpenseTypeMapper;
import ru.rgasymov.moneymanager.repository.ExpenseTypeRepository;
import ru.rgasymov.moneymanager.service.TypeService;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExpenseTypeService implements TypeService<ExpenseTypeRequestDto, ExpenseTypeResponseDto> {

    private final ExpenseTypeRepository expenseTypeRepository;

    private final UserService userService;

    private final ExpenseTypeMapper expenseTypeMapper;

    @Transactional
    @Override
    public ExpenseTypeResponseDto create(ExpenseTypeRequestDto dto) {
        User currentUser = userService.getCurrentUser();
        ExpenseType newExpenseType = ExpenseType.builder()
                .name(dto.getName())
                .user(currentUser)
                .build();
        ExpenseType saved = expenseTypeRepository.save(newExpenseType);
        return expenseTypeMapper.toDto(saved);
    }

    @Transactional
    @Override
    public void delete(Long id) {
        User currentUser = userService.getCurrentUser();
        expenseTypeRepository.deleteByIdAndUserId(id, currentUser.getId());
    }

    @Transactional(readOnly = true)
    @Override
    public Set<ExpenseTypeResponseDto> findAll() {
        User currentUser = userService.getCurrentUser();
        Set<ExpenseType> result = expenseTypeRepository.findAllByUserId(currentUser.getId());
        return expenseTypeMapper.toDtos(result);
    }
}
