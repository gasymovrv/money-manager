import { Button, Dialog, DialogActions } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { EditOperationDialogProps, EditOperationProps } from '../../interfaces/common.interface';
import moment from 'moment';
import CommonOperationDialog from './common-operation.dialog';
import { WithEditIncomeActions } from '../../hocs/with-edit-income-actions';
import { WithEditExpenseActions } from '../../hocs/with-edit-expense-actions';
import { COMMON_ERROR_MSG, DATE_FORMAT } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMainTable } from '../../services/async-dispatch.service';
import { SavingsFilterParamsMap } from '../../interfaces/saving.interface';
import { PaginationParams } from '../../interfaces/main-table.interface';
import { showSuccess } from '../../actions/success.actions';
import { showError } from '../../actions/error.actions';
import { isPastOrToday } from '../../helpers/date.helper';
import { AuthContext } from '../../interfaces/auth-context.interface';
import { getSavingsFilter } from '../../helpers/common.helper';
import CommonTitleDialog from './common-title.dialog';
import { AddExpenseDialog, AddIncomeDialog } from './add-operation.dialog';
import { OperationType } from '../../interfaces/operation.interface';

const EditOperationDialog: React.FC<EditOperationDialogProps & EditOperationProps> = ({
                                                                                        operation,
                                                                                        operationType,
                                                                                        categories,
                                                                                        open,
                                                                                        handleClose,
                                                                                        editOperation,
                                                                                        deleteOperation
                                                                                      }) => {
  const dispatch = useDispatch();
  const paginationParams: PaginationParams = useSelector(({pagination}: any) => pagination);
  const accountId = useContext(AuthContext).user.currentAccount.id;
  const savingsFilterMap: SavingsFilterParamsMap = useSelector(({savingsFilterMap}: any) => savingsFilterMap);
  const savingsFilter = getSavingsFilter(accountId, savingsFilterMap);

  const [value, setValue] = useState<number>(operation.value);
  const [description, setDescription] = useState<string>(operation.description || '');
  const [categoryId, setCategoryId] = useState<number>(operation.category.id);
  const [date, setDate] = useState(moment(operation.date));
  const [isPlanned, setIsPlanned] = useState<boolean>(operation.isPlanned);
  const [openAddIncome, setOpenAddIncome] = useState(false);
  const [openAddExpense, setOpenAddExpense] = useState(false);

  const isNotValidForSave = !value || !categoryId || (isPlanned && isPastOrToday(date));
  const isNotValidForClone = !operation.value
    || !operation.category.id
    || (operation.isPlanned && isPastOrToday(operation.date));

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(+event.target.value)
  }

  const handleChangeIsPlanned = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlanned(event.target.checked)
  }

  const handleChangeTypeId = (event: React.ChangeEvent<any>) => {
    setCategoryId(event.target.value)
  }

  const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value)
  }

  const handleChangeDate = (date: any) => {
    setDate(date);
    if (date && date.isAfter(moment(), 'days')) {
      setIsPlanned(true);
    }
  }

  const handleSave = async () => {
    try {
      await editOperation(operation.id, {
        value: value,
        date: date.format(DATE_FORMAT),
        description: description,
        categoryId: categoryId,
        isPlanned: isPlanned,
      });
      handleClose();
      dispatch(fetchMainTable(paginationParams, savingsFilter));
      dispatch(showSuccess('The operation has been successfully edited'));
    } catch (error) {
      handleClose();
      console.log(error);
      dispatch((showError(COMMON_ERROR_MSG)))
    }
  }

  const handleDelete = async () => {
    try {
      await deleteOperation(operation.id);
      handleClose();
      dispatch(fetchMainTable(paginationParams, savingsFilter));
      dispatch(showSuccess('The operation has been successfully deleted'));
    } catch (error) {
      handleClose();
      console.log(error);
      dispatch((showError(COMMON_ERROR_MSG)))
    }
  }

  const handleClone = () => {
    if (operationType === OperationType.INCOME) {
      handleCancel();
      setOpenAddIncome(true);
    } else if (operationType === OperationType.EXPENSE) {
      handleCancel();
      setOpenAddExpense(true);
    }
  }

  const handleCancel = async () => {
    setValue(operation.value);
    setDescription(operation.description || '');
    setCategoryId(operation.category.id);
    setDate(moment(operation.date));
    setIsPlanned(operation.isPlanned);
    handleClose();
  }

  return (
    <>
      <Dialog maxWidth="xs" open={open} onClose={handleCancel}>

        <CommonTitleDialog title="Edit operation" handleClose={handleCancel}/>

        <CommonOperationDialog
          value={value}
          isPlanned={isPlanned}
          categoryId={categoryId}
          description={description}
          date={date}
          categories={categories}
          handleChangeValue={handleChangeValue}
          handleChangeIsPlanned={handleChangeIsPlanned}
          handleChangeDate={handleChangeDate}
          handleChangeDescription={handleChangeDescription}
          handleChangeCategoryId={handleChangeTypeId}
        />

        <DialogActions>
          <Button disabled={isNotValidForClone} onClick={handleClone} color="inherit">
            Clone
          </Button>
          <Button onClick={handleDelete} color="inherit">
            Delete
          </Button>
          <Button disabled={isNotValidForSave} onClick={handleSave} color="inherit">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <AddIncomeDialog
        open={openAddIncome}
        draft={operation}
        handleClose={() => setOpenAddIncome(false)}
      />
      <AddExpenseDialog
        open={openAddExpense}
        draft={operation}
        handleClose={() => setOpenAddExpense(false)}
      />
    </>
  );
}
export const EditIncomeDialog = WithEditIncomeActions<EditOperationDialogProps>(EditOperationDialog);
export const EditExpenseDialog = WithEditExpenseActions<EditOperationDialogProps>(EditOperationDialog);