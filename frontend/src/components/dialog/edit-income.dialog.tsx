import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { OperationType } from '../../interfaces/operation.interface';
import { deleteIncome, editIncome, getIncomeTypes } from '../../services/api.service';
import ErrorNotification from '../notification/error.notification';
import SuccessNotification from '../notification/success.notification';
import { typesSort } from '../../helpers/sort.helper';
import { EditDialogProps } from '../../interfaces/common.interface';
import moment from 'moment/moment';
import CommonContentDialog from './common-content.dialog';

const EditIncomeDialog: React.FC<EditDialogProps> = ({
                                                       entity: income,
                                                       onAction,
                                                       open,
                                                       handleClose
                                                     }) => {
  const [successEdit, setSuccessEdit] = useState<boolean>(false);
  const [successDelete, setSuccessDelete] = useState<boolean>(false);
  const [errorEdit, setErrorEdit] = useState<boolean>(false);
  const [errorDelete, setErrorDelete] = useState<boolean>(false);
  const [isLoadingTypes, setLoadingTypes] = useState<boolean>(true);
  const [types, setTypes] = useState<OperationType[]>([]);

  const [value, setValue] = useState<number>(income.value);
  const [description, setDescription] = useState<string>(income.description || '');
  const [typeId, setTypeId] = useState<number>(income.type.id);
  const [selectedDate, setDate] = useState(moment());
  const [inputDateValue, setInputDateValue] = useState(moment(income.date).format('YYYY-MM-DD'));

  useEffect(() => {
    getIncomeTypes()
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

  const handleSaveIncome = async () => {
    setSuccessEdit(false);
    setErrorEdit(false);
    try {
      await editIncome(income.id, {
        value: value,
        date: inputDateValue,
        description: description,
        typeId: typeId,
      });
      setSuccessEdit(true);
      onAction();
    } catch (error) {
      console.log(error);
      setErrorEdit(true);
    }
    handleClose();
  }

  const handleDeleteIncome = async () => {
    setSuccessDelete(false);
    setErrorDelete(false);
    try {
      await deleteIncome(income.id);
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

        <DialogTitle>Edit income</DialogTitle>

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
          <Button onClick={handleDeleteIncome} color="inherit">
            Delete
          </Button>
          <Button
            disabled={!value || !typeId}
            onClick={handleSaveIncome}
            color="inherit"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {successEdit && <SuccessNotification text="The income has been successfully edited"/>}
      {successDelete && <SuccessNotification text="The income has been successfully deleted"/>}
      {(errorEdit || errorDelete) && <ErrorNotification text="Something went wrong"/>}
    </>
  );
}
export default EditIncomeDialog;