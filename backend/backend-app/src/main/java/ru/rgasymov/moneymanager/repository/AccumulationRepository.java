package ru.rgasymov.moneymanager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.rgasymov.moneymanager.domain.entity.Accumulation;

public interface AccumulationRepository extends JpaRepository<Accumulation, Long> {
}
