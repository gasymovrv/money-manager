package ru.rgasymov.moneymanager.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.rgasymov.moneymanager.domain.entity.User;
import ru.rgasymov.moneymanager.repository.IncomeRepository;
import ru.rgasymov.moneymanager.service.UserService;

@Service
@RequiredArgsConstructor
@Slf4j
public class AccountTestService {

  private final IncomeRepository incomeRepository;

  private final UserService userService;


  /*
  Чтобы избежать влияния второй транзакции на первую при параллельном доступе
  можно добавить Isolation.REPEATABLE_READ, однако тогда будет выбрасываться исключение и первая
  откатится.

  Благодаря локам в методе findByIdAndAccountIdLock получилось сделать так, чтобы вторая транзакция
  ожидала и оба метода в итоге успешно выполняются
  */

  @Transactional
  //@Transactional(isolation = Isolation.REPEATABLE_READ)
  public void test1() {
    System.out.println("test1 started " + LocalDateTime.now());

    final User currentUser = userService.getCurrentUser();
    //var inc = incomeRepository
    //    .findByIdAndAccountId(1L, currentUser.getCurrentAccount().getId())
    //    .orElseThrow();
    var inc = incomeRepository
        .findByIdAndAccountIdLock(1L, currentUser.getCurrentAccount().getId())
        .orElseThrow();

    System.out.println("test1, inc: " + inc);
    try {
      Thread.sleep(5000L);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }

    inc.setValue(inc.getValue().add(BigDecimal.ONE));
    var saved = incomeRepository.save(inc);

    System.out.println("test1, saved inc: " + saved);
  }

  @Transactional
  //@Transactional(isolation = Isolation.REPEATABLE_READ)
  public void test2() {
    System.out.println("test2 started " + LocalDateTime.now());

    final User currentUser = userService.getCurrentUser();
    //var inc = incomeRepository
    //    .findByIdAndAccountId(1L, currentUser.getCurrentAccount().getId())
    //    .orElseThrow();
    var inc = incomeRepository
        .findByIdAndAccountIdLock(1L, currentUser.getCurrentAccount().getId())
        .orElseThrow();

    System.out.println("test2, inc: " + inc);

    inc.setDescription("updated from test 2!");
    inc.setValue(inc.getValue().add(BigDecimal.valueOf(5L)));
    var saved = incomeRepository.save(inc);

    System.out.println("test2 completed: " + saved);
  }
}
