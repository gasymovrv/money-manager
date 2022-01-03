package ru.rgasymov.moneymanager.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOidcUserService {

  //private final UserRepository userRepository;
  //
  //@Transactional
  //@Override
  //public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
  //  OidcUser oidcUser = super.loadUser(userRequest);
  //
  //  try {
  //    return processOidcUser(oidcUser);
  //  } catch (Exception ex) {
  //    log.error("# Authorization error occurred", ex);
  //    throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
  //  }
  //}
  //
  //private OidcUser processOidcUser(OidcUser oidcUser) {
  //  String id = oidcUser.getClaim("sub");
  //  User user = userRepository.findById(id).orElseGet(() -> {
  //    var newUser = new User();
  //    newUser.setId(id);
  //    newUser.setName(oidcUser.getClaim("name"));
  //    newUser.setEmail(oidcUser.getClaim("email"));
  //    newUser.setLocale(oidcUser.getClaim("locale"));
  //    newUser.setPicture(oidcUser.getClaim("picture"));
  //
  //    var account = Account.builder()
  //        .user(newUser)
  //        .name("Default account")
  //        .theme(AccountTheme.LIGHT)
  //        .currency(Currency.getInstance("USD").getCurrencyCode())
  //        .build();
  //    newUser.setCurrentAccount(account);
  //    return newUser;
  //  });
  //  user.setLastVisit(LocalDateTime.now());
  //  var saved = userRepository.save(user);
  //
  //  log.info("# User was successfully logged in: {}", saved);
  //  return new OidcUserProxy(oidcUser, saved);
  //}
}
