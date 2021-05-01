package ru.rgasymov.moneymanager.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {

  void uploadXlsx(MultipartFile file);
}
