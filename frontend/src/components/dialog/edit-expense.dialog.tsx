import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Expense, ExpenseType } from '../../interfaces/expense.interface';
import { deleteExpense, editExpense, getExpenseTypes } from '../../services/api.service';
import ErrorNotification from '../notification/error.notification';
import SuccessNotification from '../notification/success.notification';
import { typesSort } from '../../helpers/sort.helper';
import { EditDialogProps } from '../../interfaces/common.interface';
import moment from 'moment/moment';
import CommonContentDialog from './common-content.dialog';

const EditExpenseDialog: React.FC<EditDialogProps<Expense>> = ({
                                                                 entity: expense,
                                                                 onAction,
                                                                 open,
                                                                 handleClose
                                                               }) => {
  const [successEdit, setSuccessEdit] = useState<boolean>(false);
  const [successDelete, setSuccessDelete] = useState<boolean>(false);
  const [errorEdit, setErrorEdit] = useState<boolean>(false);
  const [errorDelete, setErrorDelete] = useState<boolean>(false);
  const [isLoadingTypes, setLoadingTypes] = useState<boolean>(true);
  const [types, setTypes] = useState<ExpenseType[]>([]);

  const [value, setValue] = useState<number>(expense.value);
  const [description, setDescription] = useState<string>(expense.description || '');
  const [typeId, setTypeId] = useState<number>(expense.expenseType.id);
  const [selectedDate, setDate] = useState(moment());
  const [inputDateValue, setInputDateValue] = useState(moment(expense.date).format('YYYY-MM-DD'));

  useEffect(() => {
    getExpenseTypes()
      .then((data) => {
        if (data.length) {
          setTypes(data.sort(typesSort));
        }
        setLoadingTypes(false)
      });
  }, [])

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(+event.target.value)
  }

  const handleChangeTypeId = (event: React.ChangeEvent<any>) => {
    setTypeId(event.target.value)
  }

  const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value)
  }

  const handleChangeDate = (date: any, value: any) => {
    setDate(date);
    setInputDateValue(value);
  }

  const handleSaveExpense = async () => {
    setSuccessEdit(false);
    setErrorEdit(false);
    try {
      await editExpense(expense.id, {
        value: value,
        date: inputDateValue,
        description: description,
        expenseTypeId: typeId,
      });
      setSuccessEdit(true);
      onAction();
    } catch (error) {
      console.log(error);
      setErrorEdit(true);
    }
    handleClose();
  }

  const handleDeleteExpense = async () => {
    setSuccessDelete(false);
    setErrorDelete(false);
    try {
      await deleteExpense(expense.id);
      onAction();
      setSuccessDelete(true);
    } catch (error) {
      console.log(error);
      setErrorDelete(true);
    }
    handleClose();
  }

  return (
    <>
      <Dialog maxWidth="xs" open={open} onClose={handleClose}>

        <DialogTitle>Edit expense</DialogTitle>

        <CommonContentDialog
          value={value}
          typeId={typeId}
          description={description}
          selectedDate={selectedDate}
          inputDateValue={inputDateValue}
          types={types}
          isLoadingTypes={isLoadingTypes}
          handleChangeValue={handleChangeValue}
          handleChangeDate={handleChangeDate}
          handleChangeDescription={handleChangeDescription}
          handleChangeTypeId={handleChangeTypeId}
        />

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteExpense} color="inherit">
            Delete
          </Button>
          <Button
            disabled={!value || !typeId}
            onClick={handleSaveExpense}
            color="inherit"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {successEdit && <SuccessNotification text="The expense has been successfully edited"/>}
      {successDelete && <SuccessNotification text="The expense has been successfully deleted"/>}
      {(errorEdit || errorDelete) && <ErrorNotification text="Something went wrong"/>}
    </>
  );
}
export default EditExpenseDialog;