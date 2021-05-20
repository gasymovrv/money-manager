import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { OperationType } from '../../interfaces/operation.interface';
import { addExpense, getExpenseTypes } from '../../services/api.service';
import moment from 'moment/moment';
import ErrorNotification from '../notification/error.notification';
import SuccessNotification from '../notification/success.notification';
import { typesSort } from '../../helpers/sort.helper';
import { DialogProps } from '../../interfaces/common.interface';
import CommonModal from '../modal/common.modal';
import CommonContentDialog from './common-content.dialog';


const AddExpenseDialog: React.FC<DialogProps> = ({
                                                   open,
                                                   onAction,
                                                   handleClose
                                                 }) => {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isLoadingTypes, setLoadingTypes] = useState<boolean>(true);
  const [types, setTypes] = useState<OperationType[]>([]);
  const [noTypes, setNoTypes] = useState<boolean>(true);

  const [value, setValue] = useState<number>(100);
  const [description, setDescription] = useState<string>();
  const [typeId, setTypeId] = useState<number>(0);
  const [selectedDate, setDate] = useState(moment());
  const [inputDateValue, setInputDateValue] = useState(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    getExpenseTypes()
      .then((data) => {
        if (data.length) {
          setTypes(data.sort(typesSort));
          setTypeId(data[0].id)
          setNoTypes(false)
        } else {
          setNoTypes(true)
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
    setSuccess(false);
    setError(false);
    try {
      await addExpense({
        typeId: typeId,
        date: inputDateValue,
        description: description,
        value: value
      });
      setSuccess(true);
      onAction();
    } catch (error) {
      console.log(error);
      setError(true);
    }
    handleClose();
  }

  if (noTypes) {
    return (
      <CommonModal
        open={open}
        handleClose={handleClose}
        title="Warning"
        text="Before adding expense, you need to add at least one expense type"
      />
    )
  }

  return (
    <>
      <Dialog maxWidth="xs" open={open} onClose={handleClose}>

        <DialogTitle>Add expense</DialogTitle>

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
          <Button
            disabled={!value || !typeId || !inputDateValue}
            onClick={handleSaveExpense}
            color="inherit"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {success && <SuccessNotification text="New expense has been successfully added"/>}
      {error && <ErrorNotification text="Something went wrong"/>}
    </>
  );
}
export default AddExpenseDialog;