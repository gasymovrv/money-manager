import React from 'react';
import {
  Grid,
  IconButton,
  LinearProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import { MainTableProps, Row } from '../../interfaces/main-table.interface';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import AddIncomeTypeDialog from '../dialog/add-income-type.dialog';
import AddExpenseTypeDialog from '../dialog/add-expense-type.dialog';
import StyledTableCell from './styled-table-cell';
import MainTableRow from './main-table-row';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: '80vh',
      maxHeight: 650,
    },
    top24: {
      top: 24
    },
    boldFont: {
      fontSize: 14,
      fontWeight: 'bold'
    }
  })
);

const MainTable: React.FC<MainTableProps> = ({
                                               refreshTable,
                                               isLoading,
                                               incomeTypes,
                                               expenseTypes,
                                               rows,
                                               totalElements,
                                               page,
                                               pageSize,
                                               handleChangePage,
                                               handleChangeRowsPerPage
                                             }) => {
  const classes = useStyles();

  const [showIncomeTypes, setShowIncomeTypes] = React.useState(true);
  const [showExpenseTypes, setShowExpenseTypes] = React.useState(true);
  const [openAddIncomeType, setOpenAddIncomeType] = React.useState(false);
  const [openAddExpenseType, setOpenAddExpenseType] = React.useState(false);

  const handleHideIncomeTypes = () => {
    setShowIncomeTypes(!showIncomeTypes);
  }

  const handleHideExpenseTypes = () => {
    setShowExpenseTypes(!showExpenseTypes);
  }

  const handleOpenAddIncomeType = () => {
    setOpenAddIncomeType(true);
  }

  const handleOpenAddExpenseType = () => {
    setOpenAddExpenseType(true);
  }

  const handleCloseAddIncomeType = () => {
    setOpenAddIncomeType(false);
  }

  const handleCloseAddExpenseType = () => {
    setOpenAddExpenseType(false);
  }

  console.log('Main Table rendering')
  return (
    isLoading ?
      <LinearProgress/> :
      <Paper>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">

            <TableHead>
              <TableRow>
                <StyledTableCell className={classes.boldFont}>
                  Date
                </StyledTableCell>

                <StyledTableCell className={classes.boldFont}
                                 colSpan={showIncomeTypes ? incomeTypes.length + 1 : 1}>
                  <Grid justify="center" container>
                    <Grid item>Incomes</Grid>
                    <Grid item>
                      <IconButton size="small" onClick={handleHideIncomeTypes}>
                        {showIncomeTypes ?
                          <ExpandLessIcon fontSize="small"/> :
                          <ExpandMoreIcon fontSize="small"/>
                        }
                      </IconButton>
                      <IconButton size="small" onClick={handleOpenAddIncomeType}>
                        <AddCircleIcon fontSize="small"/>
                      </IconButton>
                      <AddIncomeTypeDialog
                        open={openAddIncomeType}
                        handleClose={handleCloseAddIncomeType}
                        onSave={refreshTable}
                      />
                    </Grid>
                  </Grid>
                </StyledTableCell>

                <StyledTableCell className={classes.boldFont}
                                 colSpan={showExpenseTypes ? expenseTypes.length + 1 : 1}>
                  <Grid justify="center" container>
                    <Grid item>Expenses</Grid>
                    <Grid item>
                      <IconButton size="small" onClick={handleHideExpenseTypes}>
                        {showExpenseTypes ?
                          <ExpandLessIcon fontSize="small"/> :
                          <ExpandMoreIcon fontSize="small"/>
                        }
                      </IconButton>
                      <IconButton size="small" onClick={handleOpenAddExpenseType}>
                        <AddCircleIcon fontSize="small"/>
                      </IconButton>
                      <AddExpenseTypeDialog
                        open={openAddExpenseType}
                        handleClose={handleCloseAddExpenseType}
                        onSave={refreshTable}
                      />
                    </Grid>
                  </Grid>
                </StyledTableCell>

                <StyledTableCell className={classes.boldFont}>
                  Savings
                </StyledTableCell>
              </TableRow>

              <TableRow>
                <StyledTableCell className={classes.top24}/>

                {showIncomeTypes && incomeTypes.map(({id, name}) =>
                  <StyledTableCell key={id} className={classes.top24}>
                    {name}
                  </StyledTableCell>
                )}

                <StyledTableCell className={`${classes.top24} ${classes.boldFont}`}>
                  {showIncomeTypes && 'Incomes sum'}
                </StyledTableCell>

                {showExpenseTypes && expenseTypes.map(({id, name}) =>
                  <StyledTableCell key={id} className={classes.top24}>
                    {name}
                  </StyledTableCell>
                )}

                <StyledTableCell className={`${classes.top24} ${classes.boldFont}`}>
                  {showExpenseTypes && 'Expenses sum'}
                </StyledTableCell>

                <StyledTableCell className={classes.top24}/>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row: Row, i) =>
                <MainTableRow
                  key={row.id}
                  row={row}
                  showIncomeTypes={showIncomeTypes}
                  showExpenseTypes={showExpenseTypes}
                />
              )}
            </TableBody>

          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100, 500, 1000]}
          component="div"
          count={totalElements}
          rowsPerPage={pageSize}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
  );
}

export default MainTable;
