package ru.rgasymov.moneymanager.service;

import org.springframework.web.multipart.MultipartFile;

public interface UploadService {

  void uploadXlsx(MultipartFile file);
}
