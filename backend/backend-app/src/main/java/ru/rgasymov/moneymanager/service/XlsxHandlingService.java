package ru.rgasymov.moneymanager.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.springframework.core.io.Resource;
import ru.rgasymov.moneymanager.domain.XlsxParsingResult;
import ru.rgasymov.moneymanager.domain.dto.response.SavingResponseDto;

public interface XlsxHandlingService {

  XlsxParsingResult parse(File file) throws IOException, InvalidFormatException;

  Resource generate(InputStream template,
                    List<SavingResponseDto> data) throws IOException, InvalidFormatException;
}
