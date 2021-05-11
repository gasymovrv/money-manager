package ru.rgasymov.moneymanager.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.SortedSet;
import java.util.TreeSet;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import ru.rgasymov.moneymanager.domain.XlsxParsingResult;
import ru.rgasymov.moneymanager.domain.dto.response.AccumulationResponseDto;
import ru.rgasymov.moneymanager.domain.entity.Expense;
import ru.rgasymov.moneymanager.domain.entity.ExpenseType;
import ru.rgasymov.moneymanager.domain.entity.Income;
import ru.rgasymov.moneymanager.domain.entity.IncomeType;
import ru.rgasymov.moneymanager.service.UserService;
import ru.rgasymov.moneymanager.service.XlsxHandlingService;

@Service
@RequiredArgsConstructor
@Slf4j
public class XlsxHandlingServiceImpl implements XlsxHandlingService {
  /**
   * The number of columns after the last income column.
   */
  private static final int COLUMNS_AFTER_LAST_INCOME = 1;

  /**
   * Index of row with type names.
   */
  private static final int TYPES_ROW = 1;

  /**
   * Index of first row with income or expense.
   */
  private static final int START_ROW = 3;

  /**
   * Index of first incomes column.
   */
  private static final int START_COLUMN = 1;

  /**
   * Column name of the sum of incomes.
   */
  private static final String INCOMES_SUM_COLUMN_NAME = "Incomes sum";

  /**
   * Column name of the sum of expenses.
   */
  private static final String EXPENSES_SUM_COLUMN_NAME = "Expenses sum";

  /**
   * Index of previous savings row.
   */
  private static final int PREVIOUS_SAVINGS_ROW = 2;

  /**
   * Column name of the previous savings value.
   */
  private static final String PREVIOUS_SAVINGS_COLUMN_NAME = "Savings";

  private final UserService userService;

  @Override
  public XlsxParsingResult parse(File file) throws IOException, InvalidFormatException {
    var workBook = new XSSFWorkbook(file);
    var sheetIterator = workBook.sheetIterator();

    XlsxParsingResult result = null;
    SortedSet<XSSFSheet> sortedSheets =
        new TreeSet<>(Comparator.comparing(XSSFSheet::getSheetName));

    while (sheetIterator.hasNext()) {
      var sheet = (XSSFSheet) sheetIterator.next();
      sortedSheets.add(sheet);

      var incTypesRow = sheet.getRow(TYPES_ROW);
      var expTypesRow = sheet.getRow(TYPES_ROW);

      XlsxParsingResult tempResult = extractData(sheet, incTypesRow, expTypesRow);
      if (result != null) {
        result.add(tempResult);
      } else {
        result = tempResult;
      }
    }

    addPrevSavings(result, sortedSheets);
    return result;
  }

  @Override
  public Resource generate(InputStream template,
                           List<AccumulationResponseDto> data) throws IOException {
    XSSFWorkbook wb = new XSSFWorkbook(template);
    //todo handle data
    try (wb; ByteArrayOutputStream os = new ByteArrayOutputStream()) {
      wb.write(os);
      return new ByteArrayResource(os.toByteArray());
    }
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

      for (int j = START_COLUMN; j <= row.getLastCellNum(); j++) {
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

    for (int i = incomeLastCol + COLUMNS_AFTER_LAST_INCOME;
         i <= expTypesRow.getLastCellNum();
         i++) {
      var cell = expTypesRow.getCell(i);
      var cellValue = cell.getStringCellValue();

      if (cellValue.equals(EXPENSES_SUM_COLUMN_NAME)) {
        return;
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

    for (int i = START_COLUMN; i <= incTypesRow.getLastCellNum(); i++) {
      var cell = incTypesRow.getCell(i);
      var cellValue = cell.getStringCellValue();

      if (cellValue.equals(INCOMES_SUM_COLUMN_NAME)) {
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

  private void addPrevSavings(XlsxParsingResult result,
                              SortedSet<XSSFSheet> sortedSheets) {
    XSSFSheet oldest = sortedSheets.first();
    XSSFRow headRow = oldest.getRow(0);

    for (Cell cell : headRow) {
      if (cell != null
          && cell.getCellType() == CellType.STRING
          && cell.getStringCellValue().equals(PREVIOUS_SAVINGS_COLUMN_NAME)) {

        XSSFCell prevSavingsCell =
            oldest.getRow(PREVIOUS_SAVINGS_ROW).getCell(cell.getColumnIndex());
        double prevSavingsValue = prevSavingsCell.getNumericCellValue();

        if (prevSavingsValue != 0) {
          result.setPreviousSavings(new BigDecimal(prevSavingsValue));
          result.setPreviousSavingsDate(
              LocalDate.of(Integer.parseInt(oldest.getSheetName()), 1, 1));
        }
        return;
      }
    }
  }
}
