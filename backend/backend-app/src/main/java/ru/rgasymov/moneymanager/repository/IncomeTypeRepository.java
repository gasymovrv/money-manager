package ru.rgasymov.moneymanager.repository;

import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.rgasymov.moneymanager.domain.entity.IncomeType;

public interface IncomeTypeRepository extends JpaRepository<IncomeType, Long> {

    Optional<IncomeType> findByIdAndUserId(Long id, String userId);

    void deleteByIdAndUserId(Long id, String userId);

    Set<IncomeType> findAllByUserId(String userId);
}
