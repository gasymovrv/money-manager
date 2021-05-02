package ru.rgasymov.moneymanager.controller.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.rgasymov.moneymanager.service.FileService;

@RestController
@RequiredArgsConstructor
@RequestMapping("${server.api-base-url}/files")
@Slf4j
public class FileController {

  private final FileService fileService;

  @RequestMapping(value = "/xlsx/upload",
      method = RequestMethod.POST,
      consumes = "multipart/form-data")
  public void uploadXlsx(@RequestPart("file") MultipartFile file) {
    log.info("# Upload xlsx file");
    fileService.uploadXlsx(file);
  }

  @GetMapping("/xlsx/generate")
  public ResponseEntity<Resource> generateXlsx() {
    log.info("# Generate xlsx file");
    return fileService.generateXlsx();
  }

  @GetMapping("/xlsx/template")
  public ResponseEntity<Resource> downloadXlsxTemplate() {
    log.info("# Download xlsx template");
    return fileService.getXlsxTemplate();
  }
}
