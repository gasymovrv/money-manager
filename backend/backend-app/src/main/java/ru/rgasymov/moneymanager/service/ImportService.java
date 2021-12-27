package ru.rgasymov.moneymanager.service;

import ru.rgasymov.moneymanager.domain.XlsxParsingResult;

public interface ImportService {

  boolean isNonReadyForImport();

  /**
   * This method can be invoked only when current account is empty
   * (no savings, no categories with operations).
   * Call isNonReadyForImport() to check it.
   *
   * @param parsingResult function that parses xlsx file
   */
  void importFromXlsx(XlsxParsingResult parsingResult);
}
