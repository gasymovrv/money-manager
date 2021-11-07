package ru.rgasymov.moneymanager.specs;

import java.time.LocalDate;
import javax.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;
import ru.rgasymov.moneymanager.domain.entity.Account_;
import ru.rgasymov.moneymanager.domain.entity.ExpenseCategory_;
import ru.rgasymov.moneymanager.domain.entity.Expense_;
import ru.rgasymov.moneymanager.domain.entity.IncomeCategory_;
import ru.rgasymov.moneymanager.domain.entity.Income_;
import ru.rgasymov.moneymanager.domain.entity.Saving;
import ru.rgasymov.moneymanager.domain.entity.Saving_;
import ru.rgasymov.moneymanager.util.SpecUtils;

public final class SavingSpec {

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
    var pattern = SpecUtils.prepareSearchPattern(searchText);

    return (saving, cq, cb) -> {
      cq.distinct(true);
      var incomeListJoin = saving.join(Saving_.incomes, JoinType.LEFT);
      var expenseListJoin = saving.join(Saving_.expenses, JoinType.LEFT);

      var incomeDescriptionPath = incomeListJoin.get(Income_.description);
      var expenseDescriptionPath = expenseListJoin.get(Expense_.description);

      var incomeCategoryNamePath =
          incomeListJoin.join(Income_.category, JoinType.LEFT).get(IncomeCategory_.name);
      var expenseCategoryNamePath =
          expenseListJoin.join(Expense_.category, JoinType.LEFT).get(ExpenseCategory_.name);

      return cb.or(
          cb.like(cb.lower(incomeDescriptionPath), pattern),
          cb.like(cb.lower(expenseDescriptionPath), pattern),
          cb.like(cb.lower(incomeCategoryNamePath), pattern),
          cb.like(cb.lower(expenseCategoryNamePath), pattern)
      );
    };
  }
}
