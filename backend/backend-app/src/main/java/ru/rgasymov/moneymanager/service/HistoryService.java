package ru.rgasymov.moneymanager.service;

import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.domain.dto.response.HistoryActionDto;
import ru.rgasymov.moneymanager.domain.dto.response.OperationResponseDto;
import ru.rgasymov.moneymanager.repository.HistoryRepository;

@Service
@RequiredArgsConstructor
@Slf4j
public class HistoryService {

  private final HistoryRepository historyRepository;

  private final UserService userService;

  @Transactional(readOnly = true)
  public List<HistoryActionDto> findAll() {
    var list = historyRepository.findAll();
    // todo
    return new ArrayList<>();
  }

  @Transactional
  public void create(OperationResponseDto oldOperation, OperationResponseDto newOperation) {
    var currentUser = userService.getCurrentUser();
    var currentAccountId = currentUser.getCurrentAccount().getId();
    // todo
  }
}
