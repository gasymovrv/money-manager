package ru.rgasymov.moneymanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.rgasymov.moneymanager.domain.entity.Income;

public interface IncomeRepository extends JpaRepository<Income, Long> {
}
