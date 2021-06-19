import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import React, { useState } from 'react';
import { EditOperationDialogProps, EditOperationProps } from '../../interfaces/common.interface';
import moment from 'moment';
import CommonOperationDialog from './common-operation.dialog';
import { WithEditIncomeActions } from '../../hocs/with-edit-income-actions';
import { WithEditExpenseActions } from '../../hocs/with-edit-expense-actions';
import { COMMON_ERROR_MSG, DATE_FORMAT } from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMainTable } from '../../services/async-dispatch.service';
import { SavingsFilterParams } from '../../interfaces/saving.interface';
import { PaginationParams } from '../../interfaces/main-table.interface';
import { showSuccess } from '../../actions/success.actions';
import { showError } from '../../actions/error.actions';
import { isPastOrToday } from '../../helpers/date.helper';

const EditOperationDialog: React.FC<EditOperationDialogProps & EditOperationProps> = ({
                                                                                        operation,
                                                                                        categories,
                                                                                        open,
                                                                                        handleClose,
                                                                                        editOperation,
                                                                                        deleteOperation
                                                                                      }) => {
  const dispatch = useDispatch();
  const savingsFilter: SavingsFilterParams = useSelector(({savingsFilter}: any) => savingsFilter);
  const paginationParams: PaginationParams = useSelector(({pagination}: any) => pagination);

  const [value, setValue] = useState<number>(operation.value);
  const [description, setDescription] = useState<string>(operation.description || '');
  const [categoryId, setCategoryId] = useState<number>(operation.category.id);
  const [date, setDate] = useState(moment(operation.date));
  const [isPlanned, setIsPlanned] = useState<boolean>(operation.isPlanned);

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
      dispatch(fetchMainTable(paginationParams, savingsFilter));
      dispatch(showSuccess('The operation has been successfully edited'));
    } catch (error) {
      console.log(error);
      dispatch((showError(COMMON_ERROR_MSG)))
    }
    handleClose();
  }

  const handleDelete = async () => {
    try {
      await deleteOperation(operation.id);
      dispatch(fetchMainTable(paginationParams, savingsFilter));
      dispatch(showSuccess('The operation has been successfully deleted'));
    } catch (error) {
      console.log(error);
      dispatch((showError(COMMON_ERROR_MSG)))
    }
    handleClose();
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
    <Dialog maxWidth="xs" open={open} onClose={handleClose}>

      <DialogTitle>Edit operation</DialogTitle>

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
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="inherit">
          Delete
        </Button>
        <Button
          disabled={
            !value
            || !categoryId
            || (isPlanned && isPastOrToday(date))
          }
          onClick={handleSave}
          color="inherit"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export const EditIncomeDialog = WithEditIncomeActions<EditOperationDialogProps>(EditOperationDialog);
export const EditExpenseDialog = WithEditExpenseActions<EditOperationDialogProps>(EditOperationDialog);