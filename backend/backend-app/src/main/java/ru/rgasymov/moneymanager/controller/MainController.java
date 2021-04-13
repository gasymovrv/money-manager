package ru.rgasymov.moneymanager.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.service.UserService;
import springfox.documentation.annotations.ApiIgnore;

@ApiIgnore
@Controller
@RequiredArgsConstructor
@RequestMapping("/")
public class MainController {

  private static final String GOOGLE_AUTHORIZATION_URI = "oauth2/authorization/google";

  private final UserService userService;

  @GetMapping
  public String root(Model model,
                     @AuthenticationPrincipal(expression = "idToken") OidcIdToken token) {
    User user = userService.findByOidcToken(token);
    model.addAttribute("user", user);
    return "index";
  }

  @GetMapping("/login")
  public String getLoginPage(Model model) {
    model.addAttribute("googleAuthUri", GOOGLE_AUTHORIZATION_URI);
    return "login";
  }
}
