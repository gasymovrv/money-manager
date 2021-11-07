package ru.rgasymov.moneymanager.specs;

import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import ru.rgasymov.moneymanager.domain.entity.BaseOperation;
import ru.rgasymov.moneymanager.domain.entity.BaseOperation_;
import ru.rgasymov.moneymanager.domain.entity.Saving_;

public final class BaseOperationSpec {

  private BaseOperationSpec() {
  }

  public static <R extends BaseOperation> Specification<R> savingIdIn(List<Long> savingIds) {
    return (operationRoot, cq, cb) -> operationRoot
        .get(BaseOperation_.saving)
        .get(Saving_.id)
        .in(savingIds);
  }
}
