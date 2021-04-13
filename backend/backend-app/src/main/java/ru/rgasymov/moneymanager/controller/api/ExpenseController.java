package ru.rgasymov.moneymanager.controller.api;

import java.util.List;
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
import ru.rgasymov.moneymanager.domain.dto.request.ExpenseRequestDto;
import ru.rgasymov.moneymanager.domain.dto.request.ExpenseTypeRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.ExpenseResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.ExpenseTypeResponseDto;
import ru.rgasymov.moneymanager.service.ExpenseService;
import ru.rgasymov.moneymanager.service.UserService;
import ru.rgasymov.moneymanager.service.impl.ExpenseTypeService;

@RestController
@RequiredArgsConstructor
@RequestMapping("${server.api-base-url}/expenses")
@Slf4j
public class ExpenseController {

  private final UserService userService;

  private final ExpenseService expenseService;

  private final ExpenseTypeService expenseTypeService;

  @GetMapping
  public List<ExpenseResponseDto> findAll() {
    log.info("# Find all expenses, current user: {}", userService.getCurrentUser());
    return expenseService.findAll();
  }

  @PostMapping
  public ExpenseResponseDto create(@RequestBody @Valid ExpenseRequestDto dto) {
    log.info("# Create a new expense by dto: {}, current user: {}", dto,
        userService.getCurrentUser());
    return expenseService.create(dto);
  }

  @PutMapping("/{id}")
  public ExpenseResponseDto update(@PathVariable Long id,
                                   @RequestBody @Valid ExpenseRequestDto dto) {
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
  public Set<ExpenseTypeResponseDto> findAllTypes() {
    log.info("# Find all expense types, current user: {}", userService.getCurrentUser());
    return expenseTypeService.findAll();
  }

  @PostMapping("/types")
  public ExpenseTypeResponseDto createType(@RequestBody @Valid ExpenseTypeRequestDto dto) {
    log.info("# Create a new expense type by dto: {}, current user: {}", dto,
        userService.getCurrentUser());
    return expenseTypeService.create(dto);
  }

  @DeleteMapping(value = "/types/{id}")
  public void deleteType(@PathVariable Long id) {
    log.info("# Delete an expense type by id: {}, current user: {}", id,
        userService.getCurrentUser());
    expenseTypeService.delete(id);
  }
}
