package ru.rgasymov.moneymanager.repository;

import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.rgasymov.moneymanager.domain.entity.ExpenseType;

public interface ExpenseTypeRepository extends JpaRepository<ExpenseType, Long> {

  Optional<ExpenseType> findByIdAndUserId(Long id, String userId);

  void deleteByIdAndUserId(Long id, String userId);

  Set<ExpenseType> findAllByUserId(String userId);

  boolean existsByUserId(String userId);
}
