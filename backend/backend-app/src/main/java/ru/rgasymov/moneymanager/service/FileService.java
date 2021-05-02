package ru.rgasymov.moneymanager.service;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface FileService {

  void uploadXlsx(MultipartFile file);

  ResponseEntity<Resource> generateXlsx();

  ResponseEntity<Resource> getXlsxTemplate();
}
