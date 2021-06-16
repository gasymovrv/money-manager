import { Checkbox, DialogContent, FormControlLabel, MenuItem, TextField } from '@material-ui/core';
import React from 'react';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment, { Moment } from 'moment';
import { OperationCategory } from '../../interfaces/operation.interface';
import { DATE_FORMAT } from '../../constants';
import { isPastOrToday } from '../../helpers/date.helper';
import EditableMoneyFormat from '../money-format/editable-money-format';

type CommonContentDialogProps = {
  value: number,
  isPlanned: boolean,
  selectedDate: Moment,
  inputDateValue: string,
  description?: string,
  categoryId: number,
  categories: OperationCategory[],

  handleChangeValue(event: React.ChangeEvent<HTMLInputElement>): void
  handleChangeIsPlanned(event: React.ChangeEvent<HTMLInputElement>): void
  handleChangeDescription(event: React.ChangeEvent<HTMLInputElement>): void
  handleChangeCategoryId(event: React.ChangeEvent<any>): void
  handleChangeDate(date: any, value: any): void
}

const CommonOperationDialog: React.FC<CommonContentDialogProps> = ({
                                                                     value,
                                                                     isPlanned,
                                                                     categoryId,
                                                                     description,
                                                                     selectedDate,
                                                                     inputDateValue,
                                                                     categories,
                                                                     handleChangeValue,
                                                                     handleChangeIsPlanned,
                                                                     handleChangeDescription,
                                                                     handleChangeCategoryId,
                                                                     handleChangeDate
                                                                   }) => {
  const isSelectedDatePastOrToday = isPastOrToday(selectedDate);
  return (
    <DialogContent>
      <TextField
        error={!value}
        required
        autoFocus
        color="secondary"
        margin="normal"
        label="Amount"
        fullWidth
        value={value}
        onChange={handleChangeValue}
        InputProps={{
          inputComponent: EditableMoneyFormat as any
        }}
      />

      <TextField
        color="secondary"
        margin="normal"
        label="Description"
        type="text"
        fullWidth
        value={description}
        onChange={handleChangeDescription}
      />

      <TextField
        error={!categoryId}
        margin="normal"
        select
        required
        fullWidth
        color="secondary"
        label="Category"
        value={categoryId}
        onChange={handleChangeCategoryId}
      >
        {categories.map(({id, name}) =>
          <MenuItem key={id} value={id}>{name}</MenuItem>
        )}
      </TextField>

      <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDatePicker
          error={!inputDateValue || (isPlanned && isSelectedDatePastOrToday)}
          margin="normal"
          required
          fullWidth
          format={DATE_FORMAT}
          value={selectedDate}
          inputValue={inputDateValue}
          onChange={handleChangeDate}
          minDate={isPlanned ? moment().add(1, 'days') : undefined}
          label="Date"
          color="secondary"
        />
      </MuiPickersUtilsProvider>

      <FormControlLabel
        label="Planned"
        control={
          <Checkbox
            disabled={selectedDate && !isPlanned ? isSelectedDatePastOrToday : false}
            checked={isPlanned}
            color="secondary"
            onChange={handleChangeIsPlanned}
          />
        }
      />

    </DialogContent>
  );
}
export default CommonOperationDialog;