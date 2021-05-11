package ru.rgasymov.moneymanager.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ru.rgasymov.moneymanager.domain.OidcUserProxy;
import ru.rgasymov.moneymanager.domain.dto.response.UserResponseDto;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.UserMapper;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

  private final UserMapper userMapper;

  @Override
  public User getCurrentUser() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    var principal = (OidcUserProxy) authentication.getPrincipal();
    return principal.currentUser();
  }

  @Override
  public UserResponseDto getCurrentUserAsDto() {
    return userMapper.toDto(getCurrentUser());
  }

}
