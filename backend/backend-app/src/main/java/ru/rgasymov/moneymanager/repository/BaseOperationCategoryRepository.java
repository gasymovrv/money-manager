package ru.rgasymov.moneymanager.repository;

import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;
import ru.rgasymov.moneymanager.domain.entity.BaseOperationCategory;

@NoRepositoryBean
public interface BaseOperationCategoryRepository<T extends BaseOperationCategory>
    extends JpaRepository<T, Long> {

  Optional<T> findByIdAndUserId(Long id, String userId);

  void deleteByIdAndUserId(Long id, String userId);

  Set<T> findAllByUserId(String userId);

  boolean existsByUserId(String userId);

  boolean existsByNameAndUserId(String name, String userId);
}
