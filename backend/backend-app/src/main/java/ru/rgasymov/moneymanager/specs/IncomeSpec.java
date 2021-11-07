package ru.rgasymov.moneymanager.specs;

import org.springframework.data.jpa.domain.Specification;
import ru.rgasymov.moneymanager.domain.entity.ExpenseCategory_;
import ru.rgasymov.moneymanager.domain.entity.Income;
import ru.rgasymov.moneymanager.domain.entity.Income_;
import ru.rgasymov.moneymanager.util.SpecUtils;

public final class IncomeSpec {

  private IncomeSpec() {
  }

  public static Specification<Income> matchBySearchText(String searchText) {
    var pattern = SpecUtils.prepareSearchPattern(searchText);
    return (income, cq, cb) -> {
      var categoryNamePath = income.get(Income_.category).get(ExpenseCategory_.name);
      var descriptionPath = income.get(Income_.description);
      return cb.or(
          cb.like(cb.lower(categoryNamePath), pattern),
          cb.like(cb.lower(descriptionPath), pattern)
      );
    };
  }
}
