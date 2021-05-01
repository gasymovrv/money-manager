package ru.rgasymov.moneymanager.file.service;

import java.io.File;
import java.io.IOException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import ru.rgasymov.moneymanager.domain.dto.XlsxParsingResult;

public interface XlsxDataExtractionService {
  XlsxParsingResult extract(File file) throws IOException, InvalidFormatException;
}
