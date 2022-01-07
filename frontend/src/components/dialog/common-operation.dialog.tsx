import { Checkbox, DialogContent, FormControlLabel, MenuItem, TextField } from '@material-ui/core';
import React from 'react';
import moment, { Moment } from 'moment';
import { OperationCategory } from '../../interfaces/operation.interface';
import { DATE_FORMAT } from '../../constants';
import { isPastOrToday } from '../../helpers/date.helper';
import EditableMoneyFormat from '../money-format/editable-money-format';
import { CustomDatePicker } from '../date-picker/custom.date-picker';

type CommonContentDialogProps = {
  value: number,
  isPlanned: boolean,
  date: Moment,
  description?: string,
  categoryId: number,
  categories: OperationCategory[],

  handleChangeValue(event: React.ChangeEvent<HTMLInputElement>): void
  handleChangeIsPlanned(event: React.ChangeEvent<HTMLInputElement>): void
  handleChangeDescription(event: React.ChangeEvent<HTMLInputElement>): void
  handleChangeCategoryId(event: React.ChangeEvent<any>): void
  handleChangeDate(date: any): void
}

const CommonOperationDialog: React.FC<CommonContentDialogProps> = ({
                                                                     value,
                                                                     isPlanned,
                                                                     categoryId,
                                                                     description,
                                                                     date,
                                                                     categories,
                                                                     handleChangeValue,
                                                                     handleChangeIsPlanned,
                                                                     handleChangeDescription,
                                                                     handleChangeCategoryId,
                                                                     handleChangeDate
                                                                   }) => {
  const isSelectedDatePastOrToday = isPastOrToday(date);
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

      <CustomDatePicker
        error={isPlanned && isSelectedDatePastOrToday}
        margin="normal"
        required
        fullWidth
        format={DATE_FORMAT}
        value={date}
        onChange={handleChangeDate}
        minDate={isPlanned ? moment().add(1, 'days') : undefined}
        label="Date"
        color="secondary"
      />

      <FormControlLabel
        label="Planned"
        control={
          <Checkbox
            disabled={date && !isPlanned ? isSelectedDatePastOrToday : false}
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