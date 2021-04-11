package ru.rgasymov.moneymanager.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.rgasymov.moneymanager.domain.entity.Income;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    Optional<Income> findByIdAndUserId(Long id, String userId);

    void deleteByIdAndUserId(Long id, String userId);

    boolean existsByIncomeTypeId(Long typeId);
}
