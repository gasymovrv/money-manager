package ru.rgasymov.moneymanager.util;

import java.util.function.Function;
import javax.validation.constraints.NotNull;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;

public final class SpecUtils {

  private static final String ANY_CHARS = "%";

  private SpecUtils() {
  }

  public static <T, R> Specification<R> andOptionally(@NotNull Specification<R> sourceSpec,
                                                      Function<T, Specification<R>> spec,
                                                      T arg) {
    if (arg instanceof String strArg) {
      if (StringUtils.isNotBlank(strArg)) {
        return sourceSpec.and(spec.apply(arg));
      }
    } else if (arg != null) {
      return sourceSpec.and(spec.apply(arg));
    }
    return sourceSpec;
  }

  public static String prepareSearchPattern(String searchText) {
    return ANY_CHARS
        .concat(searchText.toLowerCase().replaceAll("[\\s,]+", ANY_CHARS))
        .concat(ANY_CHARS);
  }
}
