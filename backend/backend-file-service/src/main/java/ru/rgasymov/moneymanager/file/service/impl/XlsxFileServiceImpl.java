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
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.rgasymov.moneymanager.constant.DateTimeFormats;
import ru.rgasymov.moneymanager.domain.dto.XlsxParsingResult;
import ru.rgasymov.moneymanager.domain.entity.Accumulation;
import ru.rgasymov.moneymanager.file.exception.ExtractDataException;
import ru.rgasymov.moneymanager.file.exception.FileReadingException;
import ru.rgasymov.moneymanager.file.exception.IncorrectFileStorageRootException;
import ru.rgasymov.moneymanager.file.service.XlsxFileService;
import ru.rgasymov.moneymanager.file.service.XlsxHandlingService;

@Service
@RequiredArgsConstructor
@Slf4j
public class XlsxFileServiceImpl implements XlsxFileService {

  private final XlsxHandlingService xlsxHandlingService;

  private static final String UPLOADED_FILE_NAME_PATTERN = "%s/%s_%s.%s";

  private static final String DOWNLOADED_FILE_NAME = "money-manager.xlsx";

  private static final String PATH_TO_TEMPLATE = "template.xlsx";

  @Value("${file-service.root}")
  private String root;

  @Value("${file-service.delete-parsed-files}")
  private Boolean deleteUploadedFiles;

  @Override
  public XlsxParsingResult parseFile(MultipartFile multipartFile) {
    log.info("# XlsxFileService: file parsing has started");
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
      XlsxParsingResult result = xlsxHandlingService.parse(destination);
      if (deleteUploadedFiles) {
        destination.delete();
      }
      log.info("# XlsxFileService: file parsing has successfully completed");
      return result;

    } catch (Exception e) {
      log.error("# XlsxFileService: error has occurred while parsing the file");
      destination.delete();
      throw new ExtractDataException(e);
    }
  }

  @Override
  public ResponseEntity<Resource> generateFile(List<Accumulation> data) {
    log.info("# XlsxFileService: file generation has started");
    ClassPathResource resource = new ClassPathResource(PATH_TO_TEMPLATE);

    try {
      Resource result = xlsxHandlingService.generate(resource, data);
      log.info("# XlsxFileService: file generation has successfully completed");
      return ResponseEntity.ok()
          .header(HttpHeaders.CONTENT_DISPOSITION,
              String.format("attachment; filename=\"%s\"", DOWNLOADED_FILE_NAME))
          .contentType(MediaType.APPLICATION_OCTET_STREAM)
          .body(result);

    } catch (Exception e) {
      log.error("# XlsxFileService: error has occurred while generating the file");
      throw new ExtractDataException(e);
    }
  }

  private String generateFilePath(String originalFileName, Path rootPath) {
    return String.format(
        UPLOADED_FILE_NAME_PATTERN, rootPath.toString(),
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
