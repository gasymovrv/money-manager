import { Button, Dialog, DialogActions } from '@material-ui/core';
import React, { useContext, useState } from 'react';
import moment from 'moment';
import { AddOperationProps, DialogProps } from '../../interfaces/common.interface';
import CommonModal from '../modal/common.modal';
import CommonOperationDialog from './common-operation.dialog';
import { WithAddIncomeActions } from '../../hocs/with-add-income-actions';
import { WithAddExpenseActions } from '../../hocs/with-add-expense-actions';
import { COMMON_ERROR_MSG, DATE_FORMAT } from '../../constants';
import { PaginationParams } from '../../interfaces/main-table.interface';
import { useDispatch, useSelector } from 'react-redux';
import { SavingsFilterParamsMap } from '../../interfaces/saving.interface';
import { fetchMainTable } from '../../services/async-dispatch.service';
import { showError } from '../../actions/error.actions';
import { showSuccess } from '../../actions/success.actions';
import { AuthContext } from '../../interfaces/auth-context.interface';
import { getSavingsFilter } from '../../helpers/common.helper';
import CommonTitleDialog from './common-title.dialog';

const AddOperationDialog: React.FC<DialogProps & AddOperationProps> = ({
                                                                         open,
                                                                         categories,
                                                                         handleClose,
                                                                         addOperation,
                                                                         draft
                                                                       }) => {
  const dispatch = useDispatch();
  const paginationParams: PaginationParams = useSelector(({pagination}: any) => pagination);
  const accountId = useContext(AuthContext).user.currentAccount.id;
  const savingsFilterMap: SavingsFilterParamsMap = useSelector(({savingsFilterMap}: any) => savingsFilterMap);
  const savingsFilter = getSavingsFilter(accountId, savingsFilterMap);

  const [value, setValue] = useState<number>(draft ? draft.value : 100);
  const [description, setDescription] = useState<string>(draft && draft.description || '');
  const [categoryId, setCategoryId] = useState<number>(
    draft ? draft.category.id
      : (categories && categories.length ? categories[0].id : 0));
  const [date, setDate] = useState(draft ? moment(draft.date) : moment());
  const [isPlanned, setIsPlanned] = useState<boolean>(draft ? draft.isPlanned : false);

  const handleChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(+event.target.value)
  }

  const handleChangeIsPlanned = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPlanned(event.target.checked)
  }

  const handleChangeCategoryId = (event: React.ChangeEvent<any>) => {
    setCategoryId(event.target.value)
  }

  const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value)
  }

  const handleChangeDate = (date: any) => {
    setDate(date);
    if (date && date.isAfter(moment(), 'days')) {
      setIsPlanned(true);
    }
  }

  const handleSave = async () => {
    try {
      await addOperation({
        categoryId: categoryId,
        date: date.format(DATE_FORMAT),
        description: description,
        value: value,
        isPlanned: isPlanned
      });
      handleClose();
      dispatch(fetchMainTable(paginationParams, savingsFilter));
      dispatch(showSuccess('New operation has been successfully added'));
    } catch (error) {
      handleClose();
      console.log(error);
      dispatch(showError(COMMON_ERROR_MSG));
    }
  }

  const handleCancel = async () => {
    setValue(draft ? draft.value : 100);
    setDescription(draft && draft.description || '');
    setCategoryId(draft ? draft.category.id
      : (categories && categories.length ? categories[0].id : 0));
    setDate(draft ? moment(draft.date) : moment());
    setIsPlanned(draft ? draft.isPlanned : false);
    handleClose();
  }

  if (!categories.length) {
    return (
      <CommonModal
        open={open}
        handleClose={handleCancel}
        title="Warning"
        text="Before adding operation, you need to add at least one category"
      />
    )
  }

  return (
    <Dialog maxWidth="xs" open={open} onClose={handleCancel}>

      <CommonTitleDialog title="Add operation" handleClose={handleCancel}/>

      <CommonOperationDialog
        value={value}
        isPlanned={isPlanned}
        categoryId={categoryId}
        description={description}
        date={date}
        categories={categories}
        handleChangeValue={handleChangeValue}
        handleChangeIsPlanned={handleChangeIsPlanned}
        handleChangeDate={handleChangeDate}
        handleChangeDescription={handleChangeDescription}
        handleChangeCategoryId={handleChangeCategoryId}
      />

      <DialogActions>
        <Button
          disabled={!value || !categoryId || !date}
          onClick={handleSave}
          color="inherit"
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export const AddIncomeDialog = WithAddIncomeActions<DialogProps>(AddOperationDialog);
export const AddExpenseDialog = WithAddExpenseActions<DialogProps>(AddOperationDialog);
