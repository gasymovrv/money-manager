package ru.rgasymov.moneymanager.domain.enums;

import lombok.Getter;
import ru.rgasymov.moneymanager.domain.entity.Accumulation_;

@Getter
public enum AccumulationFieldToSort {
    DATE(Accumulation_.DATE);

    private final String fieldName;

    AccumulationFieldToSort(String fieldName) {
        this.fieldName = fieldName;
    }
}
