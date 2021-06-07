package ru.rgasymov.moneymanager.service;

import ru.rgasymov.moneymanager.domain.dto.response.UserResponseDto;
import ru.rgasymov.moneymanager.domain.entity.User;

public interface UserService {

  User getCurrentUser();

  void updateCurrentUser(User user);

  UserResponseDto getCurrentUserAsDto();
}
