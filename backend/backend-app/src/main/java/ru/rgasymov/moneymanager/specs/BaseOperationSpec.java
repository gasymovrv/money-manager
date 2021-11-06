package ru.rgasymov.moneymanager.specs;

import java.util.List;
import org.springframework.data.jpa.domain.Specification;
import ru.rgasymov.moneymanager.domain.entity.BaseOperation;
import ru.rgasymov.moneymanager.domain.entity.BaseOperation_;
import ru.rgasymov.moneymanager.domain.entity.Saving_;

public final class BaseOperationSpec {

  private static final String ANY_CHARS = "%";

  private BaseOperationSpec() {
  }

  public static <R extends BaseOperation> Specification<R> savingIdIn(List<Long> savingIds) {
    return (operationRoot, cq, cb) -> operationRoot
        .get(BaseOperation_.saving)
        .get(Saving_.id)
        .in(savingIds);
  }

  public static <R extends BaseOperation> Specification<R> matchBySearchText(String searchText) {
    String pattern = ANY_CHARS
        .concat(searchText.toLowerCase().replaceAll("[\\s,]+", ANY_CHARS))
        .concat(ANY_CHARS);

    return (operationRoot, cq, cb) -> {
      var descriptionPath = operationRoot.get(BaseOperation_.description);
      return cb.and(descriptionPath.isNotNull(), cb.like(cb.lower(descriptionPath), pattern));
    };
  }
}
