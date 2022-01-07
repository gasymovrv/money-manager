package ru.rgasymov.moneymanager.service;

import java.util.Optional;
import org.springframework.security.core.userdetails.UserDetails;
import ru.rgasymov.moneymanager.domain.dto.response.UserResponseDto;
import ru.rgasymov.moneymanager.domain.entity.User;

public interface UserService {

  UserDetails loadUserByIdAsUserDetails(String id);

  User getCurrentUser();

  UserResponseDto getCurrentUserAsDto();

  Optional<User> findById(String id);

  User save(User user);
}
