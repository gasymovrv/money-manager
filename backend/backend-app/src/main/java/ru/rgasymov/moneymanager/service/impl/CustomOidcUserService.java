package ru.rgasymov.moneymanager.service.impl;

import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.domain.OidcUserProxy;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.repository.UserRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOidcUserService extends OidcUserService {

  private final UserRepository userRepository;

  @Transactional
  @Override
  public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
    OidcUser oidcUser = super.loadUser(userRequest);

    try {
      return processOidcUser(oidcUser);
    } catch (Exception ex) {
      log.error("# Authorization error occurred", ex);
      throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
    }
  }

  private OidcUser processOidcUser(OidcUser oidcUser) {
    String id = oidcUser.getClaim("sub");
    User user = userRepository.findById(id).orElseGet(() -> {
      var newUser = new User();
      newUser.setId(id);
      newUser.setName(oidcUser.getClaim("name"));
      newUser.setEmail(oidcUser.getClaim("email"));
      newUser.setLocale(oidcUser.getClaim("locale"));
      newUser.setPicture(oidcUser.getClaim("picture"));
      return newUser;
    });
    user.setLastVisit(LocalDateTime.now());
    userRepository.save(user);

    log.info("# User was successfully logged in: {}", user);
    return new OidcUserProxy(oidcUser, user);
  }
}
