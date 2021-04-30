package ru.rgasymov.moneymanager.util;

import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityContextUtils {

  private static final String ROLE_ANONYMOUS = "ROLE_ANONYMOUS";

  public static boolean isAnonymous() {
    var authentication = SecurityContextHolder.getContext().getAuthentication();
    var authorities = authentication.getAuthorities();
    return authorities.stream().anyMatch(auth -> auth.getAuthority().equals(ROLE_ANONYMOUS));
  }
}
