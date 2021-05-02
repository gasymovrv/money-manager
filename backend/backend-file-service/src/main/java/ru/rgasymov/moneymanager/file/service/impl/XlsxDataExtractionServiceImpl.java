package ru.rgasymov.moneymanager.file.service.impl;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import ru.rgasymov.moneymanager.domain.dto.XlsxParsingResult;
import ru.rgasymov.moneymanager.domain.entity.Expense;
import ru.rgasymov.moneymanager.domain.entity.ExpenseType;
import ru.rgasymov.moneymanager.domain.entity.Income;
import ru.rgasymov.moneymanager.domain.entity.IncomeType;
import ru.rgasymov.moneymanager.file.service.XlsxDataExtractionService;
import ru.rgasymov.moneymanager.service.CommonUserService;

@Service
@RequiredArgsConstructor
@Slf4j
public class XlsxDataExtractionServiceImpl implements XlsxDataExtractionService {
  /**
   * The number of columns after the last income column.
   * For example, it could be 'Incomes sum'.
   */
  private static final int COLUMNS_AFTER_LAST_INCOME = 3;

  /**
   * Index of income types row.
   */
  private static final int INCOME_TYPES_ROW = 4;

  /**
   * Index of expense types row.
   */
  private static final int EXPENSE_TYPES_ROW = 3;

  /**
   * Index of first row with income or expense.
   */
  private static final int START_ROW = 6;

  /**
   * Column name of the sum of income.
   */
  private static final String INCOME_SUM_COLUMN_NAME = "сумма";

  private final CommonUserService userService;

  @Override
  public XlsxParsingResult extract(File file) throws IOException, InvalidFormatException {
    var workBook = new XSSFWorkbook(file);
    var sheetIterator = workBook.sheetIterator();

    XlsxParsingResult result = null;
    while (sheetIterator.hasNext()) {
      var sheet = (XSSFSheet) sheetIterator.next();
      var incTypesRow = sheet.getRow(INCOME_TYPES_ROW);
      var expTypesRow = sheet.getRow(EXPENSE_TYPES_ROW);

      XlsxParsingResult tempResult = extractData(sheet, incTypesRow, expTypesRow);
      if (result != null) {
        result.add(tempResult);
      } else {
        result = tempResult;
      }
    }

    return result;
  }

  private XlsxParsingResult extractData(XSSFSheet sheet,
                                        XSSFRow incTypesRow,
                                        XSSFRow expTypesRow) {
    var currentUser = userService.getCurrentUser();
    var incomes = new ArrayList<Income>();
    var expenses = new ArrayList<Expense>();
    var incomeTypes = new HashMap<Integer, IncomeType>();
    var expenseTypes = new HashMap<Integer, ExpenseType>();

    Integer incomeLastCol = findIncomeTypes(incTypesRow, incomeTypes);
    findExpenseTypes(expTypesRow, expenseTypes, incomeLastCol);

    for (int i = START_ROW; i <= sheet.getLastRowNum(); i++) {
      var row = sheet.getRow(i);
      var firstCell = row.getCell(0);

      if (CellType.NUMERIC != firstCell.getCellType()) {
        break;
      }
      LocalDateTime firstCellValue = firstCell.getLocalDateTimeCellValue();
      if (firstCellValue == null) {
        continue;
      }

      var date = firstCellValue.toLocalDate();

      for (int j = 1; j < row.getLastCellNum(); j++) {
        var cell = row.getCell(j);
        if (cell == null
            || CellType.NUMERIC != cell.getCellType()
            || cell.getCellStyle().getFillBackgroundXSSFColor() != null) {
          continue;
        }

        var columnIndex = cell.getColumnIndex();
        var cellValue = cell.getNumericCellValue();
        String cellComment = null;
        if (cell.getCellComment() != null
            && cell.getCellComment().getString() != null) {
          cellComment = cell.getCellComment().getString().toString();
        }

        var incomeType = incomeTypes.get(columnIndex);
        var expenseType = expenseTypes.get(columnIndex);

        if (incomeType != null && cellValue != 0) {
          var inc = Income.builder()
              .date(date)
              .value(new BigDecimal(cellValue))
              .incomeType(incomeType)
              .description(cellComment)
              .user(currentUser)
              .build();
          incomes.add(inc);

        } else if (expenseType != null && cellValue != 0) {
          var exp = Expense.builder()
              .date(date)
              .value(new BigDecimal(cellValue))
              .expenseType(expenseType)
              .description(cellComment)
              .user(currentUser)
              .build();
          expenses.add(exp);
        }
      }
    }

    return new XlsxParsingResult(
        incomes,
        expenses,
        new HashSet<>(incomeTypes.values()),
        new HashSet<>(expenseTypes.values())
    );
  }

  private void findExpenseTypes(XSSFRow expTypesRow,
                                HashMap<Integer, ExpenseType> expenseTypes,
                                Integer incomeLastCol) {
    if (incomeLastCol == null) {
      return;
    }
    var currentUser = userService.getCurrentUser();

    for (int i = incomeLastCol + COLUMNS_AFTER_LAST_INCOME; i <= expTypesRow.getLastCellNum(); i++) {
      var cell = expTypesRow.getCell(i);
      if (cell == null
          || CellType.STRING != cell.getCellType()) {
        break;
      }
      var cellValue = cell.getStringCellValue();

      if (StringUtils.isBlank(cellValue)) {
        break;
      } else {
        var expType = ExpenseType.builder()
            .name(cellValue)
            .user(currentUser)
            .build();
        expenseTypes.put(cell.getColumnIndex(), expType);
      }
    }
  }

  private Integer findIncomeTypes(XSSFRow incTypesRow,
                                  HashMap<Integer, IncomeType> incomeTypes) {
    var currentUser = userService.getCurrentUser();

    for (int i = 1; i <= incTypesRow.getLastCellNum(); i++) {
      var cell = incTypesRow.getCell(i);
      var cellValue = cell.getStringCellValue();

      if (cellValue.equals(INCOME_SUM_COLUMN_NAME)) {
        return cell.getColumnIndex();
      } else {
        var incType = IncomeType.builder()
            .name(cellValue)
            .user(currentUser)
            .build();
        incomeTypes.put(cell.getColumnIndex(), incType);
      }
    }
    return null;
  }
}
