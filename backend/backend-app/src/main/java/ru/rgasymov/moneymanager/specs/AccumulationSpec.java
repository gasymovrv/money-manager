package ru.rgasymov.moneymanager.specs;

import java.time.LocalDate;
import org.springframework.data.jpa.domain.Specification;
import ru.rgasymov.moneymanager.domain.entity.Accumulation;
import ru.rgasymov.moneymanager.domain.entity.Accumulation_;
import ru.rgasymov.moneymanager.domain.entity.User_;

public class AccumulationSpec {
  public static Specification<Accumulation> filterByDate(LocalDate from, LocalDate to) {
    if (from != null && to != null) {
      return dateBetween(from, to);
    } else if (from != null) {
      return dateAfter(from);
    } else if (to != null) {
      return dateBefore(to);
    }
    throw new IllegalArgumentException("FROM or TO dates must not be null");
  }

  public static Specification<Accumulation> dateBetween(LocalDate from, LocalDate to) {
    return (accumulation, cq, cb) -> cb.between(
        accumulation.get(Accumulation_.date).as(LocalDate.class), from, to);
  }

  public static Specification<Accumulation> dateAfter(LocalDate from) {
    return (accumulation, cq, cb) -> cb
        .greaterThanOrEqualTo(accumulation.get(Accumulation_.date), from);
  }

  public static Specification<Accumulation> dateBefore(LocalDate to) {
    return (accumulation, cq, cb) -> cb.lessThanOrEqualTo(accumulation.get(Accumulation_.date), to);
  }

  public static Specification<Accumulation> userIdEq(String id) {
    return (accumulation, cq, cb) ->
        cb.equal(accumulation.get(Accumulation_.user).get(User_.id), id);
  }
}
