package ru.rgasymov.moneymanager.repository;

import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import ru.rgasymov.moneymanager.domain.entity.BaseOperationCategory;

@NoRepositoryBean
public interface BaseOperationCategoryRepository<T extends BaseOperationCategory>
    extends JpaRepository<T, Long> {

  Optional<T> findByIdAndAccountId(Long id, Long accountId);

  void deleteByIdAndAccountId(Long id, Long accountId);

  void deleteAllByAccountId(Long accountId);

  Set<T> findAllByAccountId(Long accountId);

  boolean existsByAccountId(Long accountId);

  boolean existsByNameAndAccountId(String name, Long accountId);
}
