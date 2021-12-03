import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import { EditOperationCategoryDialogProps, EditOperationCategoryProps } from '../../interfaces/common.interface';
import { WithEditIncomeCategoryActions } from '../../hocs/with-edit-income-category-actions';
import { WithEditExpenseCategoryActions } from '../../hocs/with-edit-expense-category-actions';
import { useDispatch, useSelector } from 'react-redux';
import { SavingsFilterParamsMap } from '../../interfaces/saving.interface';
import { PaginationParams } from '../../interfaces/main-table.interface';
import { fetchMainTable } from '../../services/async-dispatch.service';
import { showError } from '../../actions/error.actions';
import { showSuccess } from '../../actions/success.actions';
import { COMMON_ERROR_MSG } from '../../constants';
import { AuthContext } from '../../interfaces/auth-context.interface';
import { getSavingsFilter } from '../../helpers/common.helper';

const EditOperationCategoryDialog:
  React.FC<EditOperationCategoryDialogProps & EditOperationCategoryProps> = ({
                                                                               operationCategory,
                                                                               open,
                                                                               handleClose,
                                                                               editOperationCategory,
                                                                               deleteOperationCategory
                                                                             }) => {
  const dispatch = useDispatch();
  const paginationParams: PaginationParams = useSelector(({pagination}: any) => pagination);
  const [name, setName] = useState<string>(operationCategory.name);
  const accountId = useContext(AuthContext).user.currentAccount.id;
  const savingsFilterMap: SavingsFilterParamsMap = useSelector(({savingsFilterMap}: any) => savingsFilterMap);
  const savingsFilter = getSavingsFilter(accountId, savingsFilterMap);

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleDelete = async () => {
    try {
      await deleteOperationCategory(operationCategory.id);
      dispatch(fetchMainTable(paginationParams, savingsFilter));
      dispatch(showSuccess('Category has been successfully deleted'));
    } catch (error) {
      console.log(error);
      const resp = error as Response;
      if (resp.status === 400) {
        dispatch(showError('You cannot delete this category while there are operations with this category.'));
      } else {
        dispatch(showError(COMMON_ERROR_MSG));
      }
    }
    handleClose();
  }

  const handleSave = async () => {
    try {
      await editOperationCategory(operationCategory.id, {
        name: name
      });
      dispatch(fetchMainTable(paginationParams, savingsFilter));
      dispatch(showSuccess('Category has been successfully edited'));
    } catch (error) {
      console.log(error);
      dispatch(showError(COMMON_ERROR_MSG));
    }
    handleClose();
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
        <Button onClick={handleDelete} color="inherit">
          Delete
        </Button>
        <Button disabled={!name} onClick={handleSave} color="inherit">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const EditIncomeCategoryDialog
  = WithEditIncomeCategoryActions<EditOperationCategoryDialogProps>(EditOperationCategoryDialog)
export const EditExpenseCategoryDialog
  = WithEditExpenseCategoryActions<EditOperationCategoryDialogProps>(EditOperationCategoryDialog)