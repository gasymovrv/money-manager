package ru.rgasymov.moneymanager.service.xlsx;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import ru.rgasymov.moneymanager.domain.FileExportData;
import ru.rgasymov.moneymanager.domain.FileImportResult;

public interface XlsxFileService {

  FileImportResult parse(MultipartFile file);

  ResponseEntity<Resource> generate(FileExportData data);

  ResponseEntity<Resource> getTemplate();
}
