package ru.rgasymov.moneymanager.file.service.impl;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.rgasymov.moneymanager.constant.DateTimeFormats;
import ru.rgasymov.moneymanager.domain.entity.Accumulation;
import ru.rgasymov.moneymanager.file.exception.FileReadingException;
import ru.rgasymov.moneymanager.file.exception.IncorrectFileStorageRootException;
import ru.rgasymov.moneymanager.file.service.XlsxFileService;

@Service
@RequiredArgsConstructor
@Slf4j
public class XlsxFileServiceImpl implements XlsxFileService {

  private static final String FILE_NAME_PATTERN = "%s/%s_%s.%s";

  @Value("${file-service.root}")
  private String root;

  @Override
  public List<Accumulation> parseFile(MultipartFile multipartFile) {
    log.info("# XlsxFileService: parsing file was started");
    Path rootPath = Paths.get(root);
    createRootIfNotExists(rootPath);

    List<Accumulation> result = new ArrayList<>();

    String originalFileName = multipartFile.getOriginalFilename();
    File destination = Paths.get(generateFilePath(originalFileName, rootPath)).toFile();
    try {
      FileUtils.copyInputStreamToFile(multipartFile.getInputStream(), destination);
      log.info("# File was written on disk: {}, original name: {}", destination.getName(),
          originalFileName);
    } catch (IOException e) {
      throw new FileReadingException(
          String.format("Error while reading content from file '%s'", originalFileName));
    }

    //todo do parsing xls

    log.info("# XlsxFileService: parsing file was completed");
    return result;
  }

  @Override
  public ResponseEntity<Resource> generateFile(List<Accumulation> data) {
    log.info("# XlsxFileService: generation file was started");
    return null;
  }

  private String generateFilePath(String originalFileName, Path rootPath) {
    return String.format(
        FILE_NAME_PATTERN, rootPath.toString(),
        LocalDateTime.now().format(DateTimeFormatter
            .ofPattern(DateTimeFormats.FILE_NAME_DATE_TIME_FORMAT)),
        UUID.randomUUID(),
        FilenameUtils.getExtension(originalFileName));
  }

  private void createRootIfNotExists(Path rootPath) {
    if (!Files.exists(rootPath) || !Files.isDirectory(rootPath)) {
      try {
        Files.createDirectory(rootPath);
      } catch (IOException e) {
        throw new IncorrectFileStorageRootException(
            String.format("File storage root '%s' is incorrect, could not create directory", root));
      }
    }
  }
}
