package ru.rgasymov.moneymanager.service.impl;

import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.domain.dto.request.IncomeTypeRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.IncomeTypeResponseDto;
import ru.rgasymov.moneymanager.domain.entity.IncomeType;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.IncomeTypeMapper;
import ru.rgasymov.moneymanager.repository.IncomeTypeRepository;
import ru.rgasymov.moneymanager.service.TypeService;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@RequiredArgsConstructor
@Slf4j
public class IncomeTypeService implements TypeService<IncomeTypeRequestDto, IncomeTypeResponseDto> {

    private final IncomeTypeRepository incomeTypeRepository;

    private final UserService userService;

    private final IncomeTypeMapper incomeTypeMapper;

    @Transactional
    @Override
    public IncomeTypeResponseDto create(IncomeTypeRequestDto dto) {
        User currentUser = userService.getCurrentUser();
        IncomeType newIncomeType = IncomeType.builder()
                .name(dto.getName())
                .user(currentUser)
                .build();
        IncomeType saved = incomeTypeRepository.save(newIncomeType);
        return incomeTypeMapper.toDto(saved);
    }

    @Transactional
    @Override
    public void delete(Long id) {
        User currentUser = userService.getCurrentUser();
        incomeTypeRepository.deleteByIdAndUserId(id, currentUser.getId());
    }

    @Transactional(readOnly = true)
    @Override
    public Set<IncomeTypeResponseDto> findAll() {
        User currentUser = userService.getCurrentUser();
        Set<IncomeType> result = incomeTypeRepository.findAllByUserId(currentUser.getId());
        return incomeTypeMapper.toDtos(result);
    }
}
