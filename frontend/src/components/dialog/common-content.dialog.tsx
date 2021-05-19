import { DialogContent, MenuItem, TextField } from '@material-ui/core';
import React from 'react';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Moment } from 'moment';

type CommonContentDialogProps = {
  value: number,
  selectedDate: Moment,
  inputDateValue: string,
  description?: string,
  typeId: number,
  types: Array<{ id: number, name: string }>,
  isLoadingTypes: boolean,

  handleChangeValue(event: React.ChangeEvent<HTMLInputElement>): void
  handleChangeDescription(event: React.ChangeEvent<HTMLInputElement>): void
  handleChangeTypeId(event: React.ChangeEvent<any>): void
  handleChangeDate(date: any, value: any): void
}

const CommonContentDialog: React.FC<CommonContentDialogProps> = ({
                                                                   value,
                                                                   typeId,
                                                                   description,
                                                                   selectedDate,
                                                                   inputDateValue,
                                                                   types,
                                                                   isLoadingTypes,
                                                                   handleChangeValue,
                                                                   handleChangeDescription,
                                                                   handleChangeTypeId,
                                                                   handleChangeDate
                                                                 }) => {
  return (
    <DialogContent>
      <TextField
        error={!value}
        required
        autoFocus
        color="secondary"
        margin="normal"
        id="value"
        label="Amount"
        type="number"
        fullWidth
        value={value}
        onChange={handleChangeValue}
      />

      <TextField
        color="secondary"
        margin="normal"
        id="description"
        label="Description"
        type="text"
        fullWidth
        value={description}
        onChange={handleChangeDescription}
      />

      {isLoadingTypes ||
      <TextField
          error={!typeId}
          margin="normal"
          select
          required
          fullWidth
          color="secondary"
          label="Type"
          value={typeId}
          onChange={handleChangeTypeId}
      >
        {types.map(({id, name}) =>
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
          label="Date"
          color="secondary"
        />
      </MuiPickersUtilsProvider>
    </DialogContent>
  );
}
export default CommonContentDialog;