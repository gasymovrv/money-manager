package ru.rgasymov.moneymanager.service;

import ru.rgasymov.moneymanager.domain.FileImportResult;

public interface ImportService {

  void importFromFile(FileImportResult parsingResult);
}
