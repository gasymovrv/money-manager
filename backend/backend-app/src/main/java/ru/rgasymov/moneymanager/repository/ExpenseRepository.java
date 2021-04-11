package ru.rgasymov.moneymanager.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.rgasymov.moneymanager.domain.entity.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    Optional<Expense> findByIdAndUserId(Long id, String userId);

    void deleteByIdAndUserId(Long id, String userId);

    boolean existsByExpenseTypeId(Long typeId);
}
