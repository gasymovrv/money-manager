package ru.rgasymov.moneymanager.service.xlsx;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import ru.rgasymov.moneymanager.domain.XlsxInputData;
import ru.rgasymov.moneymanager.domain.XlsxParsingResult;

public interface XlsxFileService {

  XlsxParsingResult parse(MultipartFile file);

  ResponseEntity<Resource> generate(XlsxInputData data);

  ResponseEntity<Resource> getTemplate();
}
