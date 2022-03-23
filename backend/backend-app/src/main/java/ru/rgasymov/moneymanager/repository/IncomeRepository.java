package ru.rgasymov.moneymanager.repository;

import java.util.Optional;
import javax.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.domain.entity.Income;

public interface IncomeRepository extends BaseOperationRepository<Income> {

  @Transactional
  @Lock(LockModeType.PESSIMISTIC_WRITE) // You can use Lock only on the JpaRepository methods
  @Query("SELECT i FROM Income i WHERE i.id = ?1 and i.account.id = ?2")
  Optional<Income> findByIdAndAccountIdLock(Long id, Long accountId);
}
