package ru.rgasymov.moneymanager.controller.api;

import java.util.Set;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.rgasymov.moneymanager.domain.dto.request.OperationRequestDto;
import ru.rgasymov.moneymanager.domain.dto.request.OperationTypeRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.OperationResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.OperationTypeResponseDto;
import ru.rgasymov.moneymanager.service.IncomeService;
import ru.rgasymov.moneymanager.service.IncomeTypeService;
import ru.rgasymov.moneymanager.service.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("${server.api-base-url}/incomes")
@Slf4j
public class IncomeController {

  private final UserService userService;

  private final IncomeService incomeService;

  private final IncomeTypeService incomeTypeService;

  @PostMapping
  public OperationResponseDto create(@RequestBody @Valid OperationRequestDto dto) {
    log.info("# Create a new income by dto: {}, current user: {}", dto,
        userService.getCurrentUser());
    return incomeService.createFromDto(dto);
  }

  @PutMapping("/{id}")
  public OperationResponseDto update(@PathVariable Long id,
                                     @RequestBody @Valid OperationRequestDto dto) {
    log.info("# Update the income by id: {}, dto: {}, current user: {}", id, dto,
        userService.getCurrentUser());
    return incomeService.update(id, dto);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    log.info("# Delete an income by id: {}, current user: {}", id, userService.getCurrentUser());
    incomeService.delete(id);
  }

  @GetMapping("/types")
  public Set<OperationTypeResponseDto> findAllTypes() {
    log.info("# Find all income types, current user: {}", userService.getCurrentUser());
    return incomeTypeService.findAll();
  }

  @PostMapping("/types")
  public OperationTypeResponseDto createType(@RequestBody @Valid OperationTypeRequestDto dto) {
    log.info("# Create a new income type by dto: {}, current user: {}", dto,
        userService.getCurrentUser());
    return incomeTypeService.create(dto);
  }

  @PutMapping("/types/{id}")
  public OperationTypeResponseDto updateType(@PathVariable Long id,
                                             @RequestBody @Valid OperationTypeRequestDto dto) {
    log.info("# Update the income type by id: {}, dto: {}, current user: {}", id, dto,
        userService.getCurrentUser());
    return incomeTypeService.update(id, dto);
  }

  @DeleteMapping("/types/{id}")
  public void deleteType(@PathVariable @NotNull Long id) {
    log.info("# Delete an income type by id: {}, current user: {}", id,
        userService.getCurrentUser());
    incomeTypeService.delete(id);
  }
}
