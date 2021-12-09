package ru.rgasymov.moneymanager.service.xlsx;

import java.io.File;
import java.io.IOException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import ru.rgasymov.moneymanager.domain.XlsxParsingResult;

public interface XlsxParsingService {

  XlsxParsingResult parse(File file) throws IOException, InvalidFormatException;
}
