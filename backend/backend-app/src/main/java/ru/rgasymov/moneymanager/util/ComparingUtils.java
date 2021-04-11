package ru.rgasymov.moneymanager.util;

import javax.validation.constraints.NotNull;

public class ComparingUtils {

    public static <T> boolean isChanged(T oldValue, T newValue) {
        if ((oldValue != null && !oldValue.equals(newValue))
                || (oldValue == null && newValue != null)) {
            return true;
        }
        return false;
    }

    public static <T extends Comparable<T>> boolean valueGreaterThan(@NotNull T value,
                                                                     @NotNull T newValue) {
        return value.compareTo(newValue) > 0;
    }

    public static <T extends Comparable<T>> boolean valueLessThan(@NotNull T value,
                                                                  @NotNull T newValue) {
        return value.compareTo(newValue) < 0;
    }
}
