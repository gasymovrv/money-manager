package ru.rgasymov.moneymanager.controller.api;

import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.rgasymov.moneymanager.domain.dto.response.UserResponseDto;
import ru.rgasymov.moneymanager.service.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("${server.api-base-url}/users")
public class UserController {

  private final UserService userService;

  @ApiOperation("Get current user")
  @GetMapping("/current")
  public UserResponseDto current() {
    return userService.getCurrentUserAsDto();
  }
}
