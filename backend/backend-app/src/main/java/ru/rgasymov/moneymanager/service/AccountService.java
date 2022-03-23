package ru.rgasymov.moneymanager.service;

import java.util.List;
import ru.rgasymov.moneymanager.domain.dto.request.AccountRequestDto;
import ru.rgasymov.moneymanager.domain.dto.response.AccountResponseDto;

public interface AccountService {

  List<AccountResponseDto> findAll();

  AccountResponseDto create(AccountRequestDto dto);

  AccountResponseDto update(Long id, AccountRequestDto dto);

  void delete(Long id);

  AccountResponseDto changeCurrent(Long id);

  void createDefaultCategories();

  boolean isCurrentAccountEmpty();
}
