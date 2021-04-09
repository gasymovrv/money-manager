package ru.rgasymov.moneymanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.rgasymov.moneymanager.domain.entity.Expense;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
}
