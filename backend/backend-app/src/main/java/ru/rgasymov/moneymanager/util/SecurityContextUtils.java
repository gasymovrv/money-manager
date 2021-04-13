package ru.rgasymov.moneymanager.util;

import java.util.Collection;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityContextUtils {

  private static final String ROLE_ANONYMOUS = "ROLE_ANONYMOUS";

  public static boolean isAnonymous() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
    return authorities.stream().anyMatch(auth -> auth.getAuthority().equals(ROLE_ANONYMOUS));
  }
}
