package ru.rgasymov.moneymanager.controller.api;

import java.util.Set;
import javax.validation.Valid;
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
import ru.rgasymov.moneymanager.service.ExpenseService;
import ru.rgasymov.moneymanager.service.ExpenseTypeService;
import ru.rgasymov.moneymanager.service.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("${server.api-base-url}/expenses")
@Slf4j
public class ExpenseController {

  private final UserService userService;

  private final ExpenseService expenseService;

  private final ExpenseTypeService expenseTypeService;

  @PostMapping
  public OperationResponseDto create(@RequestBody @Valid OperationRequestDto dto) {
    log.info("# Create a new expense by dto: {}, current user: {}", dto,
        userService.getCurrentUser());
    return expenseService.createFromDto(dto);
  }

  @PutMapping("/{id}")
  public OperationResponseDto update(@PathVariable Long id,
                                     @RequestBody @Valid OperationRequestDto dto) {
    log.info("# Update the expense by id: {}, dto: {}, current user: {}", id, dto,
        userService.getCurrentUser());
    return expenseService.update(id, dto);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    log.info("# Delete an expense by id: {}, current user: {}", id, userService.getCurrentUser());
    expenseService.delete(id);
  }

  @GetMapping("/types")
  public Set<OperationTypeResponseDto> findAllTypes() {
    log.info("# Find all expense types, current user: {}", userService.getCurrentUser());
    return expenseTypeService.findAll();
  }

  @PostMapping("/types")
  public OperationTypeResponseDto createType(@RequestBody @Valid OperationTypeRequestDto dto) {
    log.info("# Create a new expense type by dto: {}, current user: {}", dto,
        userService.getCurrentUser());
    return expenseTypeService.create(dto);
  }

  @PutMapping("/types/{id}")
  public OperationTypeResponseDto updateType(@PathVariable Long id,
                                             @RequestBody @Valid OperationTypeRequestDto dto) {
    log.info("# Update the expense type by id: {}, dto: {}, current user: {}", id, dto,
        userService.getCurrentUser());
    return expenseTypeService.update(id, dto);
  }

  @DeleteMapping(value = "/types/{id}")
  public void deleteType(@PathVariable Long id) {
    log.info("# Delete an expense type by id: {}, current user: {}", id,
        userService.getCurrentUser());
    expenseTypeService.delete(id);
  }
}
