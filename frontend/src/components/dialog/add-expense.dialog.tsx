import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { ExpenseType } from '../../interfaces/expense.interface';
import { addExpense, getExpenseTypes } from '../../services/api.service';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment/moment';
import ErrorNotification from '../notification/error.notification';
import SuccessNotification from '../notification/success.notification';
import { expenseTypeSort } from '../../helpers/sort.helper';

type AddExpenseDialogProps = {
  open: boolean,
  handleClose(): void
  handleSave(): void
}

const AddExpenseDialog: React.FC<AddExpenseDialogProps> =
  ({open, handleSave, handleClose}) => {
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);

    const [expValue, setExpValue] = useState<number>(100);
    const [expDescription, setDescription] = useState<string>();
    const [expTypeId, setExpTypeId] = useState<number>(0);
    const [selectedDate, setDate] = useState(moment());
    const [inputDateValue, setInputDateValue] = useState(moment().format('YYYY-MM-DD'));

    useEffect(() => {
      getExpenseTypes()
        .then((data) => {
          setExpenseTypes(data.sort(expenseTypeSort));
          setExpTypeId(data[0].id)
          setLoading(false)
        });
    }, [])

    const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
      setExpValue(+event.target.value)
    }

    const handleChangeTypeId = (event: React.ChangeEvent<any>) => {
      setExpTypeId(event.target.value)
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
          expenseTypeId: expTypeId,
          date: inputDateValue,
          description: expDescription,
          value: expValue
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
        <Dialog maxWidth="xs" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">

          <DialogTitle>Add expense</DialogTitle>

          <DialogContent>
            <TextField
              error={!expValue}
              required
              autoFocus
              color="secondary"
              margin="normal"
              id="expValue"
              label="Expense amount"
              type="number"
              fullWidth
              value={expValue}
              onChange={handleChangeValue}
            />

            <TextField
              color="secondary"
              margin="normal"
              id="expDescription"
              label="Expense description"
              type="text"
              fullWidth
              value={expDescription}
              onChange={handleChangeDescription}
            />

            {isLoading ||
            <TextField
                error={!expTypeId}
                margin="normal"
                select
                required
                fullWidth
                color="secondary"
                label="Expense type"
                value={expTypeId}
                onChange={handleChangeTypeId}
            >
              {expenseTypes.map(({id, name}) =>
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
                label="Expense date"
                color="secondary"
              />
            </MuiPickersUtilsProvider>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button disabled={!expValue || !expTypeId || !inputDateValue} onClick={handleSaveExpense} color="inherit">
              Save
            </Button>
          </DialogActions>
        </Dialog>
        {success && <SuccessNotification text="Expense has been successfully added"/>}
        {error && <ErrorNotification text="Something went wrong"/>}
      </>
    );
  }
export default AddExpenseDialog;