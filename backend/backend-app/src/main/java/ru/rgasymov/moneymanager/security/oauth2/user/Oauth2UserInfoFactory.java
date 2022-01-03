package ru.rgasymov.moneymanager.security.oauth2.user;

import java.util.Map;
import ru.rgasymov.moneymanager.constant.AuthProviders;
import ru.rgasymov.moneymanager.exception.Oauth2AuthenticationProcessingException;

public class Oauth2UserInfoFactory {

  public static Oauth2UserInfo getOauth2UserInfo(String registrationId,
                                                 Map<String, Object> attributes) {
    if (registrationId.equalsIgnoreCase(AuthProviders.GOOGLE)) {
      return new GoogleOauth2UserInfo(attributes);
    } else {
      throw new Oauth2AuthenticationProcessingException(
          "Login with " + registrationId + " is not supported yet.");
    }
  }
}
