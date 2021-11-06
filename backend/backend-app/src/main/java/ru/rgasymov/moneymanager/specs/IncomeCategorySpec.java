package ru.rgasymov.moneymanager.specs;

import org.springframework.data.jpa.domain.Specification;
import ru.rgasymov.moneymanager.domain.entity.Account_;
import ru.rgasymov.moneymanager.domain.entity.IncomeCategory;
import ru.rgasymov.moneymanager.domain.entity.IncomeCategory_;

public final class IncomeCategorySpec {

  private IncomeCategorySpec() {
  }

  public static Specification<IncomeCategory> accountIdEq(Long id) {
    return (category, cq, cb) ->
        cb.equal(category.get(IncomeCategory_.account).get(Account_.id), id);
  }
}
