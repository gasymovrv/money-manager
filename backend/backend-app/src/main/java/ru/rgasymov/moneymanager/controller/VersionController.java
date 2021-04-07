package ru.rgasymov.moneymanager.controller;

import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.info.BuildProperties;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("${server.api-base-url}/version")
public class VersionController {

    private final BuildProperties buildProperties;

    @ApiOperation("Get current version")
    @GetMapping
    public String version() {
        return buildProperties.getVersion();
    }
}
