import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import React, { useState } from 'react';
import { EditOperationDialogProps, EditOperationProps } from '../../interfaces/common.interface';
import moment from 'moment/moment';
import CommonOperationDialog from './common-operation.dialog';
import { WithEditIncomeActions } from '../../hocs/with-edit-income-actions';
import { WithEditExpenseActions } from '../../hocs/with-edit-expense-actions';
import SuccessNotification from '../notification/success.notification';
import ErrorNotification from '../notification/error.notification';
import { DATE_FORMAT } from '../../helpers/date.helper';

const EditOperationDialog: React.FC<EditOperationDialogProps & EditOperationProps> = ({
                                                                                        operation,
                                                                                        categories,
                                                                                        onAction,
                                                                                        open,
                                                                                        handleClose,
                                                                                        editOperation,
                                                                                        deleteOperation
                                                                                      }) => {
  const [successEdit, setSuccessEdit] = useState<boolean>(false);
  const [successDelete, setSuccessDelete] = useState<boolean>(false);
  const [errorEdit, setErrorEdit] = useState<boolean>(false);
  const [errorDelete, setErrorDelete] = useState<boolean>(false);

  const [value, setValue] = useState<number>(operation.value);
  const [description, setDescription] = useState<string>(operation.description || '');
  const [categoryId, setCategoryId] = useState<number>(operation.category.id);
  const [selectedDate, setDate] = useState(moment());
  const [inputDateValue, setInputDateValue] = useState(moment(operation.date).format(DATE_FORMAT));

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(+event.target.value)
  }

  const handleChangeTypeId = (event: React.ChangeEvent<any>) => {
    setCategoryId(event.target.value)
  }

  const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value)
  }

  const handleChangeDate = (date: any, value: any) => {
    setDate(date);
    setInputDateValue(value);
  }

  const handleSave = async () => {
    setSuccessEdit(false);
    setErrorEdit(false);
    try {
      await editOperation(operation.id, {
        value: value,
        date: inputDateValue,
        description: description,
        categoryId: categoryId,
      });
      setSuccessEdit(true);
      onAction();
    } catch (error) {
      console.log(error);
      setErrorEdit(true);
    }
    handleClose();
  }

  const handleDelete = async () => {
    setSuccessDelete(false);
    setErrorDelete(false);
    try {
      await deleteOperation(operation.id);
      setSuccessDelete(true);
      onAction();
    } catch (error) {
      console.log(error);
      setErrorDelete(true);
    }
    handleClose();
  }

  return (
    <>
      <Dialog maxWidth="xs" open={open} onClose={handleClose}>

        <DialogTitle>Edit operation</DialogTitle>

        <CommonOperationDialog
          value={value}
          categoryId={categoryId}
          description={description}
          selectedDate={selectedDate}
          inputDateValue={inputDateValue}
          categories={categories}
          handleChangeValue={handleChangeValue}
          handleChangeDate={handleChangeDate}
          handleChangeDescription={handleChangeDescription}
          handleChangeCategoryId={handleChangeTypeId}
        />

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="inherit">
            Delete
          </Button>
          <Button
            disabled={!value || !categoryId}
            onClick={handleSave}
            color="inherit"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {successEdit && <SuccessNotification text="The operation has been successfully edited"/>}
      {successDelete && <SuccessNotification text="The operation has been successfully deleted"/>}
      {(errorEdit || errorDelete) && <ErrorNotification text="Something went wrong"/>}
    </>
  );
}
export const EditIncomeDialog = WithEditIncomeActions<EditOperationDialogProps>(EditOperationDialog);
export const EditExpenseDialog = WithEditExpenseActions<EditOperationDialogProps>(EditOperationDialog);