package ru.rgasymov.moneymanager.domain.enums;

import lombok.Getter;

@Getter
public enum AccumulationFieldToSort {
  DATE("date");

  private final String fieldName;

  AccumulationFieldToSort(String fieldName) {
    this.fieldName = fieldName;
  }
}
