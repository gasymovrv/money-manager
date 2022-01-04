package ru.rgasymov.moneymanager.service.impl;

import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.constant.CacheNames;
import ru.rgasymov.moneymanager.domain.dto.response.UserResponseDto;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.exception.ResourceNotFoundException;
import ru.rgasymov.moneymanager.mapper.UserMapper;
import ru.rgasymov.moneymanager.repository.ExpenseCategoryRepository;
import ru.rgasymov.moneymanager.repository.IncomeCategoryRepository;
import ru.rgasymov.moneymanager.repository.UserRepository;
import ru.rgasymov.moneymanager.security.UserPrincipal;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

  private final UserRepository userRepository;

  private final UserMapper userMapper;

  private final IncomeCategoryRepository incomeCategoryRepository;

  private final ExpenseCategoryRepository expenseCategoryRepository;

  @Cacheable(cacheNames = CacheNames.USERS)
  @Transactional(readOnly = true)
  @Override
  public UserDetails loadUserByIdAsUserDetails(String id) {
    var user = getUser(id);
    return UserPrincipal.create(user);
  }

  @Override
  public User getCurrentUser() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    var principal = (UserPrincipal) authentication.getPrincipal();
    return principal.getBusinessUser();
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

  @Transactional(readOnly = true)
  @Override
  public Optional<User> findByEmail(String email) {
    return userRepository.findByEmail(email);
  }

  @CacheEvict(cacheNames = {CacheNames.USERS}, allEntries = true)
  @Transactional
  @Override
  public User save(User user) {
    return userRepository.save(user);
  }

  private User getUser(String id) {
    return userRepository.findById(id).orElseThrow(
        () -> new ResourceNotFoundException("User", "id", id)
    );
  }

}
