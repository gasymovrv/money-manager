package ru.rgasymov.moneymanager.specs;

import java.time.LocalDate;
import javax.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;
import ru.rgasymov.moneymanager.domain.entity.Account_;
import ru.rgasymov.moneymanager.domain.entity.Expense_;
import ru.rgasymov.moneymanager.domain.entity.Income_;
import ru.rgasymov.moneymanager.domain.entity.Saving;
import ru.rgasymov.moneymanager.domain.entity.Saving_;

public final class SavingSpec {

  private static final String ANY_CHARS = "%";

  private SavingSpec() {
  }

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

  public static Specification<Saving> accountIdEq(Long id) {
    return (saving, cq, cb) ->
        cb.equal(saving.get(Saving_.account).get(Account_.id), id);
  }

  public static Specification<Saving> matchBySearchText(String searchText) {
    String pattern = ANY_CHARS
        .concat(searchText.toLowerCase().replaceAll("[\\s,]+", ANY_CHARS))
        .concat(ANY_CHARS);
    return (saving, cq, cb) -> {
      var incomeDescriptionPath =
          saving.join(Saving_.incomes, JoinType.LEFT).get(Income_.description);
      var expenseDescriptionPath =
          saving.join(Saving_.expenses, JoinType.LEFT).get(Expense_.description);
      var incomeDescriptionHandled = cb.lower(incomeDescriptionPath);
      var expenseDescriptionHandled = cb.lower(expenseDescriptionPath);

      return cb.or(
              cb.like(incomeDescriptionHandled, pattern),
              cb.like(expenseDescriptionHandled, pattern));
    };
  }
}
