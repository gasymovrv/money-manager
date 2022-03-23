package ru.rgasymov.moneymanager.service.xlsx;

import java.io.File;
import java.io.IOException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import ru.rgasymov.moneymanager.domain.FileImportResult;

public interface XlsxParsingService {

  FileImportResult parse(File file) throws IOException, InvalidFormatException;
}
