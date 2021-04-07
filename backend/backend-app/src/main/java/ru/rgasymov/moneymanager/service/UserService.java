package ru.rgasymov.moneymanager.service;

import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import ru.rgasymov.moneymanager.domain.entity.User;

public interface UserService {
    User findByOidcToken(OidcIdToken token);
}
