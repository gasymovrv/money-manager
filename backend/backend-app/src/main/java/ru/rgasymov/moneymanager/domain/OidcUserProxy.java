package ru.rgasymov.moneymanager.domain;

import java.util.Collection;
import java.util.Map;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import ru.rgasymov.moneymanager.domain.entity.User;

public record OidcUserProxy(
    OidcUser oidcUser,
    User currentUser
) implements OidcUser {

  @Override
  public Map<String, Object> getClaims() {
    return oidcUser.getClaims();
  }

  @Override
  public OidcUserInfo getUserInfo() {
    return oidcUser.getUserInfo();
  }

  @Override
  public OidcIdToken getIdToken() {
    return oidcUser.getIdToken();
  }

  @Override
  public Map<String, Object> getAttributes() {
    return oidcUser.getAttributes();
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return oidcUser.getAuthorities();
  }

  @Override
  public String getName() {
    return oidcUser.getName();
  }
}
