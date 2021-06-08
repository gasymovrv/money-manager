package ru.rgasymov.moneymanager.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import ru.rgasymov.moneymanager.domain.entity.BaseOperation;

@NoRepositoryBean
public interface BaseOperationRepository<T extends BaseOperation>
    extends JpaRepository<T, Long> {

  Optional<T> findByIdAndAccountId(Long id, Long userId);

  void deleteByIdAndAccountId(Long id, Long userId);

  void deleteAllByAccountId(Long accountId);

  boolean existsByCategoryId(Long categoryId);
}
