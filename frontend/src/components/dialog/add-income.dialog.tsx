import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { IncomeType } from '../../interfaces/income.interface';
import { addIncome, getIncomeTypes } from '../../services/api.service';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment/moment';
import ErrorNotification from '../notification/error.notification';
import SuccessNotification from '../notification/success.notification';
import { incomeTypeSort } from '../../helpers/sort.helper';

type AddIncomeDialogProps = {
  open: boolean,
  handleClose(): void
  handleSave(): void
}

const AddIncomeDialog: React.FC<AddIncomeDialogProps> = ({
                                                           open,
                                                           handleSave,
                                                           handleClose
                                                         }) => {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [incomeTypes, setIncomeTypes] = useState<IncomeType[]>([]);

  const [incValue, setIncValue] = useState<number>(100);
  const [incDescription, setDescription] = useState<string>();
  const [incTypeId, setIncTypeId] = useState<number>(0);
  const [selectedDate, setDate] = useState(moment());
  const [inputDateValue, setInputDateValue] = useState(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    getIncomeTypes()
      .then((data) => {
        setIncomeTypes(data.sort(incomeTypeSort));
        setIncTypeId(data[0].id)
        setLoading(false)
      });
  }, [])

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncValue(+event.target.value)
  }

  const handleChangeTypeId = (event: React.ChangeEvent<any>) => {
    setIncTypeId(event.target.value)
  }

  const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value)
  }

  const handleChangeDate = (date: any, value: any) => {
    setDate(date);
    setInputDateValue(value);
  }

  const handleSaveIncome = async () => {
    setSuccess(false);
    setError(false);
    try {
      await addIncome({
        incomeTypeId: incTypeId,
        date: inputDateValue,
        description: incDescription,
        value: incValue
      });
      handleSave();
      setSuccess(true);
    } catch (error) {
      console.log(error);
      setError(true);
    }
    handleClose();
  }

  return (
    <>
      <Dialog maxWidth="xs" open={open} onClose={handleClose}>

        <DialogTitle>Add income</DialogTitle>

        <DialogContent>
          <TextField
            error={!incValue}
            required
            autoFocus
            color="secondary"
            margin="normal"
            id="incValue"
            label="Income amount"
            type="number"
            fullWidth
            value={incValue}
            onChange={handleChangeValue}
          />

          <TextField
            color="secondary"
            margin="normal"
            id="incDescription"
            label="Income description"
            type="text"
            fullWidth
            value={incDescription}
            onChange={handleChangeDescription}
          />

          {isLoading ||
          <TextField
              error={!incTypeId}
              margin="normal"
              select
              required
              fullWidth
              color="secondary"
              label="Income type"
              value={incTypeId}
              onChange={handleChangeTypeId}
          >
            {incomeTypes.map(({id, name}) =>
              <MenuItem key={id} value={id}>{name}</MenuItem>
            )}
          </TextField>}

          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              error={!inputDateValue}
              margin="normal"
              required
              fullWidth
              showTodayButton={true}
              format="YYYY-MM-DD"
              value={selectedDate}
              inputValue={inputDateValue}
              onChange={handleChangeDate}
              label="Income date"
              color="secondary"
            />
          </MuiPickersUtilsProvider>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button disabled={!incValue || !incTypeId || !inputDateValue} onClick={handleSaveIncome} color="inherit">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {success && <SuccessNotification text="New income has been successfully added"/>}
      {error && <ErrorNotification text="Something went wrong"/>}
    </>
  );
}
export default AddIncomeDialog;