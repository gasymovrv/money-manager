package ru.rgasymov.moneymanager.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.rgasymov.moneymanager.domain.entity.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findAllByUserId(String userId);

    Optional<Expense> findByIdAndUserId(Long id, String userId);

    void deleteByIdAndUserId(Long id, String userId);

    boolean existsByExpenseTypeId(Long typeId);
}
