package ru.rgasymov.moneymanager.service.impl;

import static ru.rgasymov.moneymanager.util.ComparingUtils.isChanged;

import java.util.List;
import javax.persistence.EntityNotFoundException;
import javax.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.domain.dto.request.AccountRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.AccountResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Account;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.domain.enums.AccountTheme;
import ru.rgasymov.moneymanager.domain.enums.Currency;
import ru.rgasymov.moneymanager.mapper.AccountMapper;
import ru.rgasymov.moneymanager.repository.AccountRepository;
import ru.rgasymov.moneymanager.repository.ExpenseCategoryRepository;
import ru.rgasymov.moneymanager.repository.ExpenseRepository;
import ru.rgasymov.moneymanager.repository.IncomeCategoryRepository;
import ru.rgasymov.moneymanager.repository.IncomeRepository;
import ru.rgasymov.moneymanager.repository.SavingRepository;
import ru.rgasymov.moneymanager.repository.UserRepository;
import ru.rgasymov.moneymanager.service.AccountService;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountServiceImpl implements AccountService {

  private final AccountRepository accountRepository;
  private final IncomeRepository incomeRepository;
  private final IncomeCategoryRepository incomeCategoryRepository;
  private final ExpenseRepository expenseRepository;
  private final ExpenseCategoryRepository expenseCategoryRepository;
  private final SavingRepository savingRepository;
  private final UserRepository userRepository;

  private final AccountMapper accountMapper;

  private final UserService userService;

  @Transactional(readOnly = true)
  @Override
  public List<AccountResponseDto> findAll() {
    String userId = userService.getCurrentUser().getId();
    return accountMapper.toDtos(accountRepository.findAllByUserId(userId));
  }

  @Transactional
  @Override
  public AccountResponseDto create(AccountRequestDto dto) {
    Account account = accountMapper.fromDto(dto);
    User currentUser = userService.getCurrentUser();

    account.setUser(currentUser);
    Account saved = accountRepository.save(account);
    return accountMapper.toDto(saved);
  }

  @Transactional
  @Override
  public AccountResponseDto update(Long id, AccountRequestDto dto) {
    User currentUser = userService.getCurrentUser();
    String name = dto.getName();
    Currency currency = dto.getCurrency();
    AccountTheme theme = dto.getTheme();
    Account account = getAccount(id);

    if (isChanged(name, account.getName())
        || isChanged(currency, account.getCurrency())
        || isChanged(theme, account.getTheme())) {
      account.setName(name);
      account.setCurrency(currency);
      account.setTheme(theme);

      Account saved = accountRepository.save(account);
      if (currentUser.getCurrentAccount().getId().equals(saved.getId())) {
        currentUser.setCurrentAccount(saved);
      }
      return accountMapper.toDto(saved);
    }
    return accountMapper.toDto(account);
  }

  @Transactional
  @Override
  public void delete(Long id) {
    var currentAccountId = userService.getCurrentUser().getCurrentAccount().getId();
    if (currentAccountId.equals(id)) {
      throw new ValidationException("Cannot delete current account");
    }
    getAccount(id);

    expenseRepository.deleteAllByAccountId(id);
    incomeRepository.deleteAllByAccountId(id);
    incomeCategoryRepository.deleteAllByAccountId(id);
    expenseCategoryRepository.deleteAllByAccountId(id);
    savingRepository.deleteAllByAccountId(id);
    accountRepository.deleteById(id);
  }

  @Transactional
  @Override
  public AccountResponseDto changeCurrent(Long id) {
    User currentUser = userService.getCurrentUser();
    Account account = getAccount(id);

    currentUser.setCurrentAccount(account);
    userRepository.save(currentUser);
    return accountMapper.toDto(account);
  }

  private Account getAccount(Long id) {
    User currentUser = userService.getCurrentUser();
    return accountRepository.findByIdAndUserId(id, currentUser.getId())
        .orElseThrow(() ->
            new EntityNotFoundException(
                String.format("Could not find account with id = '%s' in the database",
                    id)));
  }
}
