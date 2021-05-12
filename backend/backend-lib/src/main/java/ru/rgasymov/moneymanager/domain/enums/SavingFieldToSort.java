package ru.rgasymov.moneymanager.domain.enums;

import lombok.Getter;

@Getter
public enum SavingFieldToSort {
  DATE("date");

  private final String fieldName;

  SavingFieldToSort(String fieldName) {
    this.fieldName = fieldName;
  }
}
