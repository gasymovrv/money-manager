package ru.rgasymov.moneymanager.service.xlsx;

import java.io.IOException;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.core.io.Resource;
import ru.rgasymov.moneymanager.domain.FileExportData;

public interface XlsxGenerationService {

  Resource generate(Resource xlsxTemplateFile,
                    FileExportData data) throws IOException, InvalidFormatException;
}
