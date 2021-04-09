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
import ru.rgasymov.moneymanager.domain.dto.request.ExpenseRequestDto;
import ru.rgasymov.moneymanager.domain.dto.request.ExpenseTypeRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.ExpenseResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.ExpenseTypeResponseDto;
import ru.rgasymov.moneymanager.service.ExpenseService;
import ru.rgasymov.moneymanager.service.impl.ExpenseTypeService;

@RestController
@RequiredArgsConstructor
@RequestMapping("${server.api-base-url}/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    private final ExpenseTypeService expenseTypeService;

    @GetMapping
    public List<ExpenseResponseDto> findAll() {
        return expenseService.findAll();
    }

    @PostMapping
    public ExpenseResponseDto create(@RequestBody @Valid ExpenseRequestDto dto) {
        return expenseService.create(dto);
    }

    @GetMapping("/types")
    public Set<ExpenseTypeResponseDto> findAllTypes() {
        return expenseTypeService.findAll();
    }

    @PostMapping("/types")
    public ExpenseTypeResponseDto createType(@RequestBody @Valid ExpenseTypeRequestDto dto) {
        return expenseTypeService.create(dto);
    }

    @DeleteMapping(value = "/types/{id}")
    public void deleteType(@PathVariable @NotNull Long id) {
        expenseTypeService.delete(id);
    }
}
