package ru.rgasymov.moneymanager.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import ru.rgasymov.moneymanager.domain.entity.User;

public interface UserRepository extends JpaRepository<User, String> {

  Optional<User> findByEmail(String email);
}
