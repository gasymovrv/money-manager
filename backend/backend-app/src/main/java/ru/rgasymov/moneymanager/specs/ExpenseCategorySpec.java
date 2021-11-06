package ru.rgasymov.moneymanager.specs;

import org.springframework.data.jpa.domain.Specification;
import ru.rgasymov.moneymanager.domain.entity.Account_;
import ru.rgasymov.moneymanager.domain.entity.ExpenseCategory;
import ru.rgasymov.moneymanager.domain.entity.ExpenseCategory_;

public final class ExpenseCategorySpec {

  private ExpenseCategorySpec() {
  }

  public static Specification<ExpenseCategory> accountIdEq(Long id) {
    return (category, cq, cb) ->
        cb.equal(category.get(ExpenseCategory_.account).get(Account_.id), id);
  }
}
