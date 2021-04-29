package ru.rgasymov.moneymanager.service.impl;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.rgasymov.moneymanager.domain.entity.Accumulation;
import ru.rgasymov.moneymanager.file.service.XlsxFileService;
import ru.rgasymov.moneymanager.service.AccumulationService;
import ru.rgasymov.moneymanager.service.UploadService;

@Service
@RequiredArgsConstructor
public class UploadServiceImpl implements UploadService {

  private final XlsxFileService xlsxFileService;

  private final AccumulationService accumulationService;

  @Override
  public void uploadXlsx(MultipartFile file) {
    List<Accumulation> accumulations = xlsxFileService.parseFile(file);
    //todo save accumulations
  }
}
