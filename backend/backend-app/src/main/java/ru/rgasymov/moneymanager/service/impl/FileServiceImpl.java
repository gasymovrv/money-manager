package ru.rgasymov.moneymanager.service.impl;

import lombok.RequiredArgsConstructor;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.rgasymov.moneymanager.domain.XlsxInputData;
import ru.rgasymov.moneymanager.domain.dto.request.SavingCriteriaDto;
import ru.rgasymov.moneymanager.exception.EmptyDataGenerationException;
import ru.rgasymov.moneymanager.exception.ImportFileException;
import ru.rgasymov.moneymanager.service.FileService;
import ru.rgasymov.moneymanager.service.ImportService;
import ru.rgasymov.moneymanager.service.SavingService;
import ru.rgasymov.moneymanager.service.xlsx.XlsxFileService;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

  private final XlsxFileService xlsxFileService;
  private final ImportService importService;
  private final SavingService savingService;

  @Value("${xlsx.max-exported-rows}")
  private int maxExportedRows;

  @Override
  public void importFromXlsx(MultipartFile file) {
    if (importService.isNonReadyForImport()) {
      throw new ImportFileException(
          "# Failed to import .xlsx file because current account is not empty");
    }
    var parsingResult = xlsxFileService.parse(file);
    importService.importFromXlsx(parsingResult);
  }

  @Override
  public ResponseEntity<Resource> exportToXlsx() {
    var criteria = new SavingCriteriaDto();
    criteria.setPageSize(maxExportedRows);
    var result = savingService.search(criteria);
    var savings = result.getResult();
    if (CollectionUtils.isEmpty(savings)) {
      throw new EmptyDataGenerationException("There is no data in current account to export");
    }

    return xlsxFileService.generate(
        new XlsxInputData(
            savings,
            result.getIncomeCategories(),
            result.getExpenseCategories()));
  }

  @Override
  public ResponseEntity<Resource> getXlsxTemplate() {
    return xlsxFileService.getTemplate();
  }
}
