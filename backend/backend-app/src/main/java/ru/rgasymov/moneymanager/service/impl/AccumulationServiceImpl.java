package ru.rgasymov.moneymanager.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.function.BiFunction;
import javax.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.domain.dto.response.AccumulationResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Accumulation;
import ru.rgasymov.moneymanager.domain.entity.Expense;
import ru.rgasymov.moneymanager.domain.entity.Income;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.AccumulationMapper;
import ru.rgasymov.moneymanager.repository.AccumulationRepository;
import ru.rgasymov.moneymanager.service.AccumulationService;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@RequiredArgsConstructor
public class AccumulationServiceImpl implements AccumulationService {

    private final AccumulationRepository accumulationRepository;

    private final AccumulationMapper accumulationMapper;

    private final UserService userService;

    @Transactional(readOnly = true)
    @Override
    public List<AccumulationResponseDto> findAll() {
        User currentUser = userService.getCurrentUser();
        String currentUserId = currentUser.getId();
        return accumulationMapper.toDtos(accumulationRepository.findAllByUserId(currentUserId));
    }

    @Transactional(readOnly = true)
    @Override
    public Accumulation findByDate(LocalDate date) {
        User currentUser = userService.getCurrentUser();
        String currentUserId = currentUser.getId();
        return accumulationRepository.findByDateAndUserId(date, currentUserId).orElseThrow(() ->
                new EntityNotFoundException(
                        String.format("Could not find accumulation by date = '%s' in the database",
                                date)));
    }

    @Transactional
    @Override
    public void recalculate(Income income) {
        User currentUser = userService.getCurrentUser();
        String currentUserId = currentUser.getId();
        BigDecimal value = income.getValue();
        LocalDate date = income.getDate();

        recalculate(date, value, BigDecimal::add,
                () -> accumulationRepository.incrementValueByDateGreaterThan(value, date, currentUserId));
    }

    @Transactional
    @Override
    public void recalculate(Expense expense) {
        User currentUser = userService.getCurrentUser();
        String currentUserId = currentUser.getId();
        BigDecimal value = expense.getValue();
        LocalDate date = expense.getDate();

        recalculate(date, value, BigDecimal::subtract,
                () -> accumulationRepository.decrementValueByDateGreaterThan(value, date, currentUserId));
    }

    private void recalculate(LocalDate date,
                             BigDecimal value,
                             BiFunction<BigDecimal, BigDecimal, BigDecimal> setValueFunc,
                             Runnable recalculateOthersFunc) {
        User currentUser = userService.getCurrentUser();
        String currentUserId = currentUser.getId();

        Optional<Accumulation> accOpt = accumulationRepository.findByDateAndUserId(date, currentUserId);

        if (accOpt.isPresent()) {
            Accumulation acc = accOpt.get();
            acc.setValue(setValueFunc.apply(acc.getValue(), value));
            accumulationRepository.save(acc);
        } else {
            accOpt = accumulationRepository.findFirstByDateLessThanAndUserIdOrderByDateDesc(date, currentUserId);

            Accumulation newAccumulation = Accumulation.builder()
                    .date(date)
                    .user(currentUser)
                    .build();

            if (accOpt.isPresent()) {
                newAccumulation.setValue(setValueFunc.apply(accOpt.get().getValue(), value));
            } else {
                newAccumulation.setValue(setValueFunc.apply(BigDecimal.ZERO, value));
            }
            accumulationRepository.save(newAccumulation);
        }

        recalculateOthersFunc.run();
    }
}
