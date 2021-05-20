package ru.rgasymov.moneymanager.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoField;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.Comment;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import ru.rgasymov.moneymanager.domain.XlsxInputData;
import ru.rgasymov.moneymanager.domain.dto.response.OperationResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.OperationTypeResponseDto;
import ru.rgasymov.moneymanager.domain.dto.response.SavingResponseDto;
import ru.rgasymov.moneymanager.service.XlsxGenerationService;

@Service
@Slf4j
public class XlsxGenerationServiceImpl implements XlsxGenerationService {

  private static final int FIRST_ROW = 0;

  /**
   * Indexes of columns with style examples.
   */
  private static final int DATE_COL = 0;
  private static final int START_INC_COL = 1;
  private static final int START_INC_SUM_COL = 2;
  private static final int START_EXP_COL = 3;
  private static final int START_EXP_SUM_COL = 4;
  private static final int START_SAVING_COL = 5;

  /**
   * Index of row with type names.
   */
  private static final int TYPES_ROW = 1;

  /**
   * Index of first row with income or expense.
   */
  private static final int START_DATA_ROW = 3;

  /**
   * Index of first incomes column.
   */
  private static final int START_DATA_COLUMN = 1;

  /**
   * Column names.
   */
  private static final String INCOMES_COLUMN_NAME = "Incomes";
  private static final String INCOMES_SUM_COLUMN_NAME = "Incomes sum";
  private static final String EXPENSES_COLUMN_NAME = "Expenses";
  private static final String EXPENSES_SUM_COLUMN_NAME = "Expenses sum";
  private static final String SAVINGS_COLUMN_NAME = "Savings";
  private static final String PREV_SAVINGS_COLUMN_NAME = "Previous savings";

  /**
   * Index of previous savings row.
   */
  private static final int PREVIOUS_SAVINGS_ROW = 2;

  @Override
  public Resource generate(String templatePath,
                           XlsxInputData data) throws IOException {
    InputStream template = new ClassPathResource(templatePath).getInputStream();
    var wb = new XSSFWorkbook(template);

    //------- Set sheet name -------
    var minYearSaving = data.savings()
        .stream()
        .min(Comparator.comparing(SavingResponseDto::getDate));
    var maxYearSaving = data.savings()
        .stream()
        .max(Comparator.comparing(SavingResponseDto::getDate));
    if (minYearSaving.isPresent() && maxYearSaving.isPresent()) {
      int minYear = minYearSaving.get().getDate().get(ChronoField.YEAR);
      int maxYear = maxYearSaving.get().getDate().get(ChronoField.YEAR);
      String sheetName = minYear == maxYear ? String.valueOf(minYear) : minYear + "-" + maxYear;
      wb.setSheetName(0, sheetName);
    }
    var sheet = wb.getSheetAt(0);

    XSSFRow firstRow = sheet.getRow(FIRST_ROW);
    XSSFRow typesRow = sheet.getRow(TYPES_ROW);
    CellStyle headerStyle = firstRow.getCell(DATE_COL).getCellStyle();

    //------------------------------ Create head rows --------------------------------------------
    //------- Create head columns for Incomes -----------
    var incColumnMap = new HashMap<String, Integer>();
    int incTypeLastCol = createTypesHeader(
        START_DATA_COLUMN,
        data.incomeTypes()
            .stream()
            .map(OperationTypeResponseDto::getName)
            .sorted()
            .collect(Collectors.toList()),
        firstRow,
        typesRow,
        headerStyle,
        incColumnMap,
        INCOMES_COLUMN_NAME,
        INCOMES_SUM_COLUMN_NAME
    );

    //------- Create head columns for Expenses -----------
    var expColumnMap = new HashMap<String, Integer>();
    int expTypeLastCol = createTypesHeader(
        incTypeLastCol + 1,
        data.expenseTypes()
            .stream()
            .map(OperationTypeResponseDto::getName)
            .sorted()
            .collect(Collectors.toList()),
        firstRow,
        typesRow,
        headerStyle,
        expColumnMap,
        EXPENSES_COLUMN_NAME,
        EXPENSES_SUM_COLUMN_NAME
    );

    //------- Create head column for Savings -----------
    int savingsCol = expTypeLastCol + 1;
    var headCell = firstRow.createCell(savingsCol, CellType.STRING);
    headCell.setCellValue(SAVINGS_COLUMN_NAME);
    headCell.setCellStyle(headerStyle);

    //------- Merge head columns -------
    sheet.addMergedRegion(
        new CellRangeAddress(FIRST_ROW, FIRST_ROW, START_DATA_COLUMN, incTypeLastCol));
    sheet.addMergedRegion(
        new CellRangeAddress(FIRST_ROW, FIRST_ROW, incTypeLastCol + 1, expTypeLastCol));
    sheet.addMergedRegion(
        new CellRangeAddress(FIRST_ROW, TYPES_ROW, savingsCol, savingsCol));

    //------------------------------ Create data rows --------------------------------------------
    createDataRows(
        wb,
        data,
        sheet,
        headerStyle,
        incTypeLastCol,
        expTypeLastCol,
        savingsCol,
        incColumnMap,
        expColumnMap
    );

    try (wb; ByteArrayOutputStream os = new ByteArrayOutputStream()) {
      wb.write(os);
      return new ByteArrayResource(os.toByteArray());
    }
  }

  private void createDataRows(Workbook workbook,
                              XlsxInputData data,
                              XSSFSheet sheet,
                              CellStyle headerStyle,
                              int incTypeLastCol,
                              int expTypeLastCol,
                              int savingsCol,
                              HashMap<String, Integer> incColumnMap,
                              HashMap<String, Integer> expColumnMap) {
    //------- Get rows styles -------
    CellStyle dateStyle = sheet.getRow(START_DATA_ROW).getCell(DATE_COL).getCellStyle();
    CellStyle incStyle = sheet.getRow(START_DATA_ROW).getCell(START_INC_COL).getCellStyle();
    CellStyle incSumStyle = sheet.getRow(START_DATA_ROW).getCell(START_INC_SUM_COL).getCellStyle();
    CellStyle expStyle = sheet.getRow(START_DATA_ROW).getCell(START_EXP_COL).getCellStyle();
    CellStyle expSumStyle = sheet.getRow(START_DATA_ROW).getCell(START_EXP_SUM_COL).getCellStyle();
    CellStyle savingsStyle = sheet.getRow(START_DATA_ROW).getCell(START_SAVING_COL).getCellStyle();

    //------- Fill previous savings row -------
    var prevSavingRow = sheet.createRow(PREVIOUS_SAVINGS_ROW);
    createStyledCells(
        prevSavingRow,
        savingsCol,
        incTypeLastCol,
        expTypeLastCol,
        dateStyle,
        savingsStyle,
        incSumStyle,
        expSumStyle,
        incStyle,
        expStyle,
        incColumnMap,
        expColumnMap
    );
    XSSFCell cell = prevSavingRow.createCell(DATE_COL, CellType.STRING);
    cell.setCellValue(PREV_SAVINGS_COLUMN_NAME);
    cell.setCellStyle(headerStyle);
    BigDecimal previousSavings = BigDecimal.ZERO;
    for (SavingResponseDto saving : data.savings()) {
      if (isPreviuosSaving(saving)) {
        previousSavings = previousSavings.add(saving.getValue());
      }
    }
    cell = prevSavingRow.getCell(savingsCol);
    cell.setCellValue(previousSavings.doubleValue());


    //------- Create incomes and expenses rows -------
    int startRow = START_DATA_ROW;
    for (SavingResponseDto dto : data.savings()) {
      if (isPreviuosSaving(dto)) {
        continue;
      }
      var row = sheet.createRow(startRow++);

      //Create styled cells
      createStyledCells(
          row,
          savingsCol,
          incTypeLastCol,
          expTypeLastCol,
          dateStyle,
          savingsStyle,
          incSumStyle,
          expSumStyle,
          incStyle,
          expStyle,
          incColumnMap,
          expColumnMap
      );

      //Fill date cell
      cell = row.getCell(DATE_COL);
      cell.setCellValue(dto.getDate());

      //Get incomes by types
      var incomeMap = new HashMap<String, OperationResponseDto>();
      dto.getIncomesByType()
          .values()
          .stream()
          .flatMap(Collection::stream)
          .forEach((inc) ->
              incomeMap.merge(inc.getType().getName(), inc,
                  ((dto1, dto2) -> {
                    dto1.setValue(dto1.getValue().add(dto2.getValue()));
                    dto1.setDescription(dto1.getDescription() + "; " + (dto2.getDescription()));
                    return dto1;
                  }))
          );
      //Fill income cells
      incomeMap.values().forEach(inc -> {
        Integer colNumByType = incColumnMap.get(inc.getType().getName());
        var incCell = row.getCell(colNumByType);
        incCell.setCellValue(inc.getValue().doubleValue());

        String description = inc.getDescription();
        if (StringUtils.isNoneBlank(description)) {
          addComment(workbook, sheet, incCell, description);
        }
      });

      //Fill incomes sum cell
      cell = row.getCell(incTypeLastCol);
      cell.setCellValue(dto.getIncomesSum().doubleValue());

      //Get expenses by types
      var expenseMap = new HashMap<String, OperationResponseDto>();
      dto.getExpensesByType()
          .values()
          .stream()
          .flatMap(Collection::stream)
          .forEach((exp) ->
              expenseMap.merge(exp.getType().getName(), exp,
                  ((dto1, dto2) -> {
                    dto1.setValue(dto1.getValue().add(dto2.getValue()));
                    dto1.setDescription(dto1.getDescription() + "; " + (dto2.getDescription()));
                    return dto1;
                  }))
          );
      //Fill expense cells
      expenseMap.values().forEach(exp -> {
        Integer colNumByType = expColumnMap.get(exp.getType().getName());
        var expCell = row.getCell(colNumByType);
        expCell.setCellValue(exp.getValue().doubleValue());

        String description = exp.getDescription();
        if (StringUtils.isNoneBlank(description)) {
          addComment(workbook, sheet, expCell, description);
        }
      });

      //Fill expenses sum cell
      cell = row.getCell(expTypeLastCol);
      cell.setCellValue(dto.getExpensesSum().doubleValue());

      //Fill saving cell
      cell = row.getCell(savingsCol);
      cell.setCellValue(dto.getValue().doubleValue());

      if (dto.getDate().equals(LocalDate.now())) {
        cell = row.createCell(savingsCol + 1, CellType.STRING);
        cell.setCellValue("Download date");

        CellStyle style = workbook.createCellStyle();
        style.setFillForegroundColor(IndexedColors.RED.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        cell.setCellStyle(style);
      }
    }
  }

  private boolean isPreviuosSaving(SavingResponseDto saving) {
    return MapUtils.isEmpty(saving.getIncomesByType())
        && MapUtils.isEmpty(saving.getExpensesByType());
  }

  public void addComment(Workbook workbook,
                         Sheet sheet,
                         Cell cell,
                         String commentText) {
    CreationHelper factory = workbook.getCreationHelper();
    ClientAnchor anchor = factory.createClientAnchor();
    //Show the comment box at the bottom right corner
    anchor
        .setCol1(cell.getColumnIndex() + 1); //the box of the comment starts at this given column...
    anchor.setCol2(cell.getColumnIndex() + 3); //...and ends at that given column
    anchor.setRow1(cell.getRowIndex() + 1); //one row below the cell...
    anchor.setRow2(cell.getRowIndex() + 5); //...and 4 rows high

    Drawing<?> drawing = sheet.createDrawingPatriarch();
    Comment comment = drawing.createCellComment(anchor);
    //set the comment text and author
    comment.setString(factory.createRichTextString(commentText));

    cell.setCellComment(comment);
  }

  private int createTypesHeader(int startCol,
                                List<String> types,
                                XSSFRow firstRow,
                                XSSFRow typesRow,
                                CellStyle headerStyle,
                                HashMap<String, Integer> expColumnMap,
                                String headerColName,
                                String headerSumColName) {
    var headCell = firstRow.createCell(startCol, CellType.STRING);
    headCell.setCellValue(headerColName);
    headCell.setCellStyle(headerStyle);
    for (String typeName : types) {
      headCell = typesRow.createCell(startCol, CellType.STRING);
      headCell.setCellValue(typeName);
      headCell.setCellStyle(headerStyle);
      expColumnMap.put(typeName, startCol);
      startCol++;
    }
    headCell = typesRow.createCell(startCol, CellType.STRING);
    headCell.setCellValue(headerSumColName);
    headCell.setCellStyle(headerStyle);
    return startCol;
  }

  private void createStyledCells(XSSFRow row,
                                 int savingsCol,
                                 int incTypeCol,
                                 int expTypeCol,
                                 CellStyle dateStyle,
                                 CellStyle savingsStyle,
                                 CellStyle incSumStyle,
                                 CellStyle expSumStyle,
                                 CellStyle incStyle,
                                 CellStyle expStyle,
                                 HashMap<String, Integer> incColumnMap,
                                 HashMap<String, Integer> expColumnMap) {
    int startColNum = DATE_COL;

    //Create date cell
    var cell = row.createCell(startColNum, CellType.NUMERIC);
    cell.setCellStyle(dateStyle);

    //Create incomes and expenses cells
    while (startColNum < savingsCol) {
      if (incColumnMap.containsValue(startColNum)) {
        cell = row.createCell(startColNum, CellType.NUMERIC);
        cell.setCellStyle(incStyle);
      }
      if (expColumnMap.containsValue(startColNum)) {
        cell = row.createCell(startColNum, CellType.NUMERIC);
        cell.setCellStyle(expStyle);
      }
      startColNum++;
    }

    //Create incomes sum cell
    cell = row.createCell(incTypeCol, CellType.NUMERIC);
    cell.setCellStyle(incSumStyle);

    //Create expenses sum cell
    cell = row.createCell(expTypeCol, CellType.NUMERIC);
    cell.setCellStyle(expSumStyle);

    //Create saving cell
    cell = row.createCell(savingsCol, CellType.NUMERIC);
    cell.setCellStyle(savingsStyle);
  }
}
