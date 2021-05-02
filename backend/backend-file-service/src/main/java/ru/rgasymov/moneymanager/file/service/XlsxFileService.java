package ru.rgasymov.moneymanager.file.service;

import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import ru.rgasymov.moneymanager.domain.dto.XlsxParsingResult;
import ru.rgasymov.moneymanager.domain.dto.response.AccumulationResponseDto;

public interface XlsxFileService {

  XlsxParsingResult parse(MultipartFile file);

  ResponseEntity<Resource> generate(List<AccumulationResponseDto> data);

  ResponseEntity<Resource> getTemplate();
}
