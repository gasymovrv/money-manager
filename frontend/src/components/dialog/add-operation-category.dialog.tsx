import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { AddOperationCategoryProps, DialogProps } from '../../interfaces/common.interface';
import { WithAddIncomeCategoryActions } from '../../hocs/with-add-income-category-actions';
import { WithAddExpenseCategoryActions } from '../../hocs/with-add-expense-category-actions';
import { useDispatch, useSelector } from 'react-redux';
import { SavingsFilterParamsMap } from '../../interfaces/saving.interface';
import { PaginationParams } from '../../interfaces/main-table.interface';
import { fetchMainTable } from '../../services/async-dispatch.service';
import { showSuccess } from '../../actions/success.actions';
import { showError } from '../../actions/error.actions';
import { COMMON_ERROR_MSG } from '../../constants';
import { AuthContext } from '../../interfaces/auth-context.interface';
import { getSavingsFilter } from '../../helpers/common.helper';

const AddOperationCategoryDialog: React.FC<DialogProps & AddOperationCategoryProps> = ({
                                                                                         open,
                                                                                         handleClose,
                                                                                         addOperationCategory
                                                                                       }) => {
  const dispatch = useDispatch();
  const paginationParams: PaginationParams = useSelector(({pagination}: any) => pagination);
  const accountId = useContext(AuthContext).user.currentAccount.id;
  const savingsFilterMap: SavingsFilterParamsMap = useSelector(({savingsFilterMap}: any) => savingsFilterMap);
  const savingsFilter = getSavingsFilter(accountId, savingsFilterMap);

  const [name, setName] = useState<string>('New category');

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleSave = async () => {
    try {
      await addOperationCategory({
        name: name
      });
      handleClose();
      dispatch(fetchMainTable(paginationParams, savingsFilter));
      dispatch(showSuccess('New category has been successfully added'));
    } catch (error) {
      console.log(error);
      const resp = error as Response;
      handleClose();
      if (resp.status === 400) {
        dispatch(showError('You cannot create category with such name'));
      } else {
        dispatch(showError(COMMON_ERROR_MSG));
      }
    }
  }

  return (
    <Dialog maxWidth="xs" open={open} onClose={handleClose}>

      <DialogTitle>Add category</DialogTitle>

      <DialogContent>
        <TextField
          required
          error={!name}
          color="secondary"
          margin="normal"
          id="categoryName"
          label="Category name"
          type="text"
          fullWidth
          value={name}
          onChange={handleChangeName}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button disabled={!name} onClick={handleSave} color="inherit">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const AddIncomeCategoryDialog = WithAddIncomeCategoryActions<DialogProps>(AddOperationCategoryDialog)
export const AddExpenseCategoryDialog = WithAddExpenseCategoryActions<DialogProps>(AddOperationCategoryDialog)