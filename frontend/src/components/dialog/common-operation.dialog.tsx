import { DialogContent, MenuItem, TextField } from '@material-ui/core';
import React from 'react';
import MomentUtils from '@date-io/moment';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { Moment } from 'moment';
import { OperationCategory } from '../../interfaces/operation.interface';

type CommonContentDialogProps = {
  value: number,
  selectedDate: Moment,
  inputDateValue: string,
  description?: string,
  categoryId: number,
  categories: OperationCategory[],
  isLoadingCategories: boolean,

  handleChangeValue(event: React.ChangeEvent<HTMLInputElement>): void
  handleChangeDescription(event: React.ChangeEvent<HTMLInputElement>): void
  handleChangeCategoryId(event: React.ChangeEvent<any>): void
  handleChangeDate(date: any, value: any): void
}

const CommonOperationDialog: React.FC<CommonContentDialogProps> = ({
                                                                     value,
                                                                     categoryId,
                                                                     description,
                                                                     selectedDate,
                                                                     inputDateValue,
                                                                     categories,
                                                                     isLoadingCategories,
                                                                     handleChangeValue,
                                                                     handleChangeDescription,
                                                                     handleChangeCategoryId,
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

      {isLoadingCategories ||
      <TextField
          error={!categoryId}
          margin="normal"
          id="category"
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
      </TextField>}

      <MuiPickersUtilsProvider utils={MomentUtils}>
        <KeyboardDatePicker
          error={!inputDateValue}
          margin="normal"
          id="date"
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
export default CommonOperationDialog;