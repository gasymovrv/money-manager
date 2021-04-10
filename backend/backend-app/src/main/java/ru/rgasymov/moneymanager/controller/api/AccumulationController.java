package ru.rgasymov.moneymanager.controller.api;

import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.rgasymov.moneymanager.domain.dto.response.AccumulationResponseDto;
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
    public List<AccumulationResponseDto> findAll() {
        log.info("# Find all accumulations, current user: {}", userService.getCurrentUser());
        return accumulationService.findAll();
    }
}
