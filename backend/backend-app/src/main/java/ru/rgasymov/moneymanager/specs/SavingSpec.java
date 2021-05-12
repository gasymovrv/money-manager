package ru.rgasymov.moneymanager.specs;

import java.time.LocalDate;
import org.springframework.data.jpa.domain.Specification;
import ru.rgasymov.moneymanager.domain.entity.Saving;
import ru.rgasymov.moneymanager.domain.entity.Saving_;
import ru.rgasymov.moneymanager.domain.entity.User_;

public class SavingSpec {
  public static Specification<Saving> filterByDate(LocalDate from, LocalDate to) {
    if (from != null && to != null) {
      return dateBetween(from, to);
    } else if (from != null) {
      return dateAfter(from);
    } else if (to != null) {
      return dateBefore(to);
    }
    throw new IllegalArgumentException("FROM or TO dates must not be null");
  }

  public static Specification<Saving> dateBetween(LocalDate from, LocalDate to) {
    return (saving, cq, cb) -> cb.between(
        saving.get(Saving_.date).as(LocalDate.class), from, to);
  }

  public static Specification<Saving> dateAfter(LocalDate from) {
    return (saving, cq, cb) -> cb
        .greaterThanOrEqualTo(saving.get(Saving_.date), from);
  }

  public static Specification<Saving> dateBefore(LocalDate to) {
    return (saving, cq, cb) -> cb.lessThanOrEqualTo(saving.get(Saving_.date), to);
  }

  public static Specification<Saving> userIdEq(String id) {
    return (saving, cq, cb) ->
        cb.equal(saving.get(Saving_.user).get(User_.id), id);
  }
}
