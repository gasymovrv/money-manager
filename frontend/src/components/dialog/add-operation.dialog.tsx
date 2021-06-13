import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import React, { useState } from 'react';
import moment from 'moment';
import { AddOperationProps, DialogProps } from '../../interfaces/common.interface';
import CommonModal from '../modal/common.modal';
import CommonOperationDialog from './common-operation.dialog';
import { WithAddIncomeActions } from '../../hocs/with-add-income-actions';
import { WithAddExpenseActions } from '../../hocs/with-add-expense-actions';
import { COMMON_ERROR_MSG, DATE_FORMAT } from '../../constants';
import { PaginationParams } from '../../interfaces/main-table.interface';
import { useDispatch, useSelector } from 'react-redux';
import { SavingsFilterParams } from '../../interfaces/saving.interface';
import { fetchMainTable } from '../../services/async-dispatch.service';
import { showError } from '../../actions/error.actions';
import { showSuccess } from '../../actions/success.actions';

const AddOperationDialog: React.FC<DialogProps & AddOperationProps> = ({
                                                                         open,
                                                                         categories,
                                                                         handleClose,
                                                                         addOperation
                                                                       }) => {
  const dispatch = useDispatch();
  const savingsFilter: SavingsFilterParams = useSelector(({savingsFilter}: any) => savingsFilter);
  const paginationParams: PaginationParams = useSelector(({pagination}: any) => pagination);

  const [value, setValue] = useState<number>(100);
  const [description, setDescription] = useState<string>();
  const [categoryId, setCategoryId] = useState<number>(categories && categories.length ? categories[0].id : 0);
  const [selectedDate, setDate] = useState(moment());
  const [inputDateValue, setInputDateValue] = useState(moment().format(DATE_FORMAT));
  const [isPlanned, setIsPlanned] = useState<boolean>(false);

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(+event.target.value)
  }

  const handleChangeIsPlanned = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlanned(event.target.checked)
  }

  const handleChangeCategoryId = (event: React.ChangeEvent<any>) => {
    setCategoryId(event.target.value)
  }

  const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value)
  }

  const handleChangeDate = (date: any, value: any) => {
    setDate(date);
    setInputDateValue(value);
    if (date && date.isAfter(moment(), 'days')) {
      setIsPlanned(true);
    }
  }

  const handleSave = async () => {
    try {
      await addOperation({
        categoryId: categoryId,
        date: inputDateValue,
        description: description,
        value: value,
        isPlanned: isPlanned
      });
      dispatch(fetchMainTable(paginationParams, savingsFilter));
      dispatch(showSuccess('New operation has been successfully added'));
    } catch (error) {
      console.log(error);
      dispatch(showError(COMMON_ERROR_MSG));
    }
    handleClose();
  }

  if (!categories.length) {
    return (
      <CommonModal
        open={open}
        handleClose={handleClose}
        title="Warning"
        text="Before adding operation, you need to add at least one category"
      />
    )
  }

  return (
    <Dialog maxWidth="xs" open={open} onClose={handleClose}>

      <DialogTitle>Add operation</DialogTitle>

      <CommonOperationDialog
        value={value}
        isPlanned={isPlanned}
        categoryId={categoryId}
        description={description}
        selectedDate={selectedDate}
        inputDateValue={inputDateValue}
        categories={categories}
        handleChangeValue={handleChangeValue}
        handleChangeIsPlanned={handleChangeIsPlanned}
        handleChangeDate={handleChangeDate}
        handleChangeDescription={handleChangeDescription}
        handleChangeCategoryId={handleChangeCategoryId}
      />

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          disabled={!value || !categoryId || !inputDateValue}
          onClick={handleSave}
          color="inherit"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const AddIncomeDialog = WithAddIncomeActions<DialogProps>(AddOperationDialog);
export const AddExpenseDialog = WithAddExpenseActions<DialogProps>(AddOperationDialog);
