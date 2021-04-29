package ru.rgasymov.moneymanager.controller.api;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ru.rgasymov.moneymanager.service.UploadService;

@RestController
@RequiredArgsConstructor
@RequestMapping("${server.api-base-url}/files")
@Slf4j
public class FileController {

  private final UploadService uploadService;

  @RequestMapping(value = "/upload/xlsx",
      method = RequestMethod.POST,
      consumes = "multipart/form-data")
  public void upload(@RequestPart("file") MultipartFile file) {
    log.info("# Upload xlsx file");
    uploadService.uploadXlsx(file);
  }
}
