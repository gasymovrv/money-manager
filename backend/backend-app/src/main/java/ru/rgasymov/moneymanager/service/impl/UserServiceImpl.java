package ru.rgasymov.moneymanager.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.stereotype.Service;
import ru.rgasymov.moneymanager.domain.OidcUserProxy;
import ru.rgasymov.moneymanager.domain.dto.response.UserResponseDto;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.mapper.UserMapper;
import ru.rgasymov.moneymanager.repository.ExpenseCategoryRepository;
import ru.rgasymov.moneymanager.repository.IncomeCategoryRepository;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

  private final UserMapper userMapper;

  private final IncomeCategoryRepository incomeCategoryRepository;

  private final ExpenseCategoryRepository expenseCategoryRepository;

  private final SessionRegistry sessionRegistry;

  @Override
  public User getCurrentUser() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    var principal = (OidcUserProxy) authentication.getPrincipal();
    return principal.getCurrentUser();
  }

  @Override
  public void updateCurrentUser(User user) {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    var principal = authentication.getPrincipal();
    var userSessions = sessionRegistry.getAllSessions(principal, false);
    userSessions.forEach(sessionInformation -> {
      OidcUserProxy oidcPrincipal = (OidcUserProxy) sessionInformation.getPrincipal();
      oidcPrincipal.setCurrentUser(user);
    });
  }

  @Override
  public UserResponseDto getCurrentUserAsDto() {
    var currentUser = getCurrentUser();
    var currentAccountId = currentUser.getCurrentAccount().getId();
    var resp = userMapper.toDto(currentUser);

    resp.getCurrentAccount().setDraft(
        !incomeCategoryRepository.existsByAccountId(currentAccountId)
            && !expenseCategoryRepository.existsByAccountId(currentAccountId)
    );
    return resp;
  }

}
