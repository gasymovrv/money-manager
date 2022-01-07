package ru.rgasymov.moneymanager.service.xlsx;

import java.io.IOException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.core.io.Resource;
import ru.rgasymov.moneymanager.domain.XlsxInputData;

public interface XlsxGenerationService {

  Resource generate(Resource xlsxTemplateFile,
                    XlsxInputData data) throws IOException, InvalidFormatException;
}