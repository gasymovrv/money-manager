package ru.rgasymov.moneymanager.controller.api;

import java.util.List;
import java.util.Set;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.rgasymov.moneymanager.domain.dto.request.IncomeRequestDto;
import ru.rgasymov.moneymanager.domain.dto.request.IncomeTypeRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.IncomeResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.IncomeTypeResponseDto;
import ru.rgasymov.moneymanager.service.IncomeService;
import ru.rgasymov.moneymanager.service.impl.IncomeTypeService;

@RestController
@RequiredArgsConstructor
@RequestMapping("${server.api-base-url}/incomes")
public class IncomeController {

    private final IncomeService incomeService;

    private final IncomeTypeService incomeTypeService;

    @GetMapping
    public List<IncomeResponseDto> findAll() {
        return incomeService.findAll();
    }

    @PostMapping
    public IncomeResponseDto create(@RequestBody @Valid IncomeRequestDto dto) {
        return incomeService.create(dto);
    }

    @GetMapping("/types")
    public Set<IncomeTypeResponseDto> findAllTypes() {
        return incomeTypeService.findAll();
    }

    @PostMapping("/types")
    public IncomeTypeResponseDto createType(@RequestBody @Valid IncomeTypeRequestDto dto) {
        return incomeTypeService.create(dto);
    }

    @DeleteMapping("/types/{id}")
    public void deleteType(@PathVariable @NotNull Long id) {
        incomeTypeService.delete(id);
    }
}
