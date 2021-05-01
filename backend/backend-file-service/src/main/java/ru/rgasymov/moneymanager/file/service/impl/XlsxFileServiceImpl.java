package ru.rgasymov.moneymanager.file.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
import ru.rgasymov.moneymanager.domain.dto.XlsxParsingResult;
import ru.rgasymov.moneymanager.domain.entity.Accumulation;
import ru.rgasymov.moneymanager.file.exception.ExtractDataException;
import ru.rgasymov.moneymanager.file.exception.FileReadingException;
import ru.rgasymov.moneymanager.file.exception.IncorrectFileStorageRootException;
import ru.rgasymov.moneymanager.file.service.XlsxDataExtractionService;
import ru.rgasymov.moneymanager.file.service.XlsxFileService;

@Service
@RequiredArgsConstructor
@Slf4j
public class XlsxFileServiceImpl implements XlsxFileService {

  private final XlsxDataExtractionService xlsxDataExtractionService;

  private static final String FILE_NAME_PATTERN = "%s/%s_%s.%s";

  @Value("${file-service.root}")
  private String root;

  @Value("${file-service.delete-parsed-files}")
  private Boolean deleteUploadedFiles;

  @Override
  public XlsxParsingResult parseFile(MultipartFile multipartFile) {
    log.info("# XlsxFileService: parsing file has started");
    var rootPath = Paths.get(root);
    createRootIfNotExists(rootPath);

    var originalFileName = multipartFile.getOriginalFilename();
    var destination = Paths.get(generateFilePath(originalFileName, rootPath)).toFile();
    try {
      FileUtils.copyInputStreamToFile(multipartFile.getInputStream(), destination);
      log.info("# File has written on disk: {}, original name: {}", destination.getName(),
          originalFileName);
    } catch (IOException e) {
      throw new FileReadingException(
          String.format("Error while reading content from file '%s'", originalFileName));
    }

    try {
      XlsxParsingResult result = xlsxDataExtractionService.extract(destination);
      if (deleteUploadedFiles) {
        destination.delete();
      }
      log.info("# XlsxFileService: parsing file has successfully completed");
      return result;

    } catch (Exception e) {
      log.error("# XlsxFileService: error has occurred while parsing file");
      destination.delete();
      throw new ExtractDataException(e);
    }
  }

  @Override
  public ResponseEntity<Resource> generateFile(List<Accumulation> data) {
    log.info("# XlsxFileService: generation file has started");
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
