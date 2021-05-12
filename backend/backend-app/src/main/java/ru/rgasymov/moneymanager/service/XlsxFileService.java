package ru.rgasymov.moneymanager.service;

import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import ru.rgasymov.moneymanager.domain.XlsxParsingResult;
import ru.rgasymov.moneymanager.domain.dto.response.SavingResponseDto;

public interface XlsxFileService {

  XlsxParsingResult parse(MultipartFile file);

  ResponseEntity<Resource> generate(List<SavingResponseDto> data);

  ResponseEntity<Resource> getTemplate();
}
