package ru.rgasymov.moneymanager.service;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {

  void importFromXlsx(MultipartFile file);

  ResponseEntity<Resource> exportToXlsx();

  ResponseEntity<Resource> getXlsxTemplate();
}
