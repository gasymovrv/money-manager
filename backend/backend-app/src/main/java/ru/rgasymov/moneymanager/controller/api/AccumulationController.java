package ru.rgasymov.moneymanager.controller.api;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.rgasymov.moneymanager.domain.dto.request.AccumulationCriteriaDto;
import ru.rgasymov.moneymanager.domain.dto.response.AccumulationResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.SearchResultDto;
import ru.rgasymov.moneymanager.service.AccumulationService;
import ru.rgasymov.moneymanager.service.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("${server.api-base-url}/accumulations")
@Slf4j
public class AccumulationController {

  private final UserService userService;

  private final AccumulationService accumulationService;

  @GetMapping
  public SearchResultDto<AccumulationResponseDto> search(@Valid AccumulationCriteriaDto criteria) {
    log.info("# Search for accumulations, criteria: {}, current user: {}", criteria,
        userService.getCurrentUser());
    return accumulationService.search(criteria);
  }
}
