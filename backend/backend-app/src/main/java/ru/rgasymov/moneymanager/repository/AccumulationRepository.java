package ru.rgasymov.moneymanager.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.rgasymov.moneymanager.domain.entity.Accumulation;

public interface AccumulationRepository extends JpaRepository<Accumulation, Long> {

    List<Accumulation> findAllByUserId(String userId);

    Optional<Accumulation> findByDateAndUserId(LocalDate date, String userId);

    Optional<Accumulation> findFirstByDateLessThanAndUserIdOrderByDateDesc(LocalDate date,
                                                                           String userId);

    @Modifying
    @Query("""
            update Accumulation a
            set a.value = a.value + :increment
            where a.date > :date and a.user.id = :userId
            """)
    void increaseValueByDateGreaterThan(@Param("increment") BigDecimal increment,
                                        @Param("date") LocalDate date,
                                        @Param("userId") String userId);

    @Modifying
    @Query("""
            update Accumulation a
            set a.value = a.value - :decrement
            where a.date > :date and a.user.id = :userId
            """)
    void decreaseValueByDateGreaterThan(@Param("decrement") BigDecimal decrement,
                                        @Param("date") LocalDate date,
                                        @Param("userId") String userId);
}
