package ru.rgasymov.moneymanager.file.service;

import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import ru.rgasymov.moneymanager.domain.entity.Accumulation;

public interface XlsxFileService {

  List<Accumulation> parseFile(MultipartFile file);

  ResponseEntity<Resource> generateFile(List<Accumulation> data);
}
