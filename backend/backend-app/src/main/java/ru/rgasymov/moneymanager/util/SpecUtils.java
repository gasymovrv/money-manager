package ru.rgasymov.moneymanager.util;

import java.util.function.Function;
import javax.validation.constraints.NotNull;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.domain.Specification;

public class SpecUtils {
    public static <T, R> Specification<R> andOptionally(@NotNull Specification<R> sourceSpec,
                                                        T arg,
                                                        Function<T, Specification<R>> spec) {
        if (arg instanceof String) {
            if (StringUtils.isNotBlank((String) arg)) {
                return sourceSpec.and(spec.apply(arg));
            }
        } else if (arg != null) {
            return sourceSpec.and(spec.apply(arg));
        }
        return sourceSpec;
    }
}
