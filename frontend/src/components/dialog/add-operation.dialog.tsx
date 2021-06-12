import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import ErrorNotification from '../notification/error.notification';
import SuccessNotification from '../notification/success.notification';
import { AddOperationProps, DialogProps } from '../../interfaces/common.interface';
import CommonModal from '../modal/common.modal';
import CommonOperationDialog from './common-operation.dialog';
import { sortCategories } from '../../helpers/sort.helper';
import { OperationCategory } from '../../interfaces/operation.interface';
import { WithAddIncomeActions } from '../../hocs/with-add-income-actions';
import { WithAddExpenseActions } from '../../hocs/with-add-expense-actions';
import { DATE_FORMAT } from '../../constants';

const AddOperationDialog: React.FC<DialogProps & AddOperationProps> = ({
                                                                         open,
                                                                         onAction,
                                                                         handleClose,
                                                                         getCategories,
                                                                         addOperation
                                                                       }) => {
  const [isLoadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [categories, setCategories] = useState<OperationCategory[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [noCategories, setNoCategories] = useState<boolean>(true);

  const [value, setValue] = useState<number>(100);
  const [description, setDescription] = useState<string>();
  const [categoryId, setCategoryId] = useState<number>(0);
  const [selectedDate, setDate] = useState(moment());
  const [inputDateValue, setInputDateValue] = useState(moment().format(DATE_FORMAT));
  const [isPlanned, setIsPlanned] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    getCategories().then((data) => {
      if (mounted) {
        if (data.length) {
          setCategories(data.sort(sortCategories));
          setCategoryId(data[0].id)
          setNoCategories(false)
        } else {
          setNoCategories(true)
        }
        setLoadingCategories(false);
      }
    })
    return () => {
      mounted = false
    };
  }, [getCategories])

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

  const handleChangeDate = (date: any, value: any) => {
    setDate(date);
    setInputDateValue(value);
    if (date && date.isAfter(moment(), 'days')) {
      setIsPlanned(true);
    }
  }

  const handleSave = async () => {
    setSuccess(false);
    setError(false);
    try {
      await addOperation({
        categoryId: categoryId,
        date: inputDateValue,
        description: description,
        value: value,
        isPlanned: isPlanned
      });
      setSuccess(true);
      await onAction();
    } catch (error) {
      console.log(error);
      setError(true);
    }
    handleClose();
  }

  if (noCategories) {
    return (
      <CommonModal
        open={open}
        handleClose={handleClose}
        title="Warning"
        text="Before adding operation, you need to add at least one category"
      />
    )
  }

  return (
    <>
      <Dialog maxWidth="xs" open={open} onClose={handleClose}>

        <DialogTitle>Add operation</DialogTitle>

        <CommonOperationDialog
          value={value}
          isPlanned={isPlanned}
          categoryId={categoryId}
          description={description}
          selectedDate={selectedDate}
          inputDateValue={inputDateValue}
          categories={categories}
          isLoadingCategories={isLoadingCategories}
          handleChangeValue={handleChangeValue}
          handleChangeIsPlanned={handleChangeIsPlanned}
          handleChangeDate={handleChangeDate}
          handleChangeDescription={handleChangeDescription}
          handleChangeCategoryId={handleChangeCategoryId}
        />

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            disabled={!value || !categoryId || !inputDateValue}
            onClick={handleSave}
            color="inherit"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {success && <SuccessNotification text="New operation has been successfully added"/>}
      {error && <ErrorNotification text="Something went wrong"/>}
    </>
  );
}

export const AddIncomeDialog = WithAddIncomeActions<DialogProps>(AddOperationDialog);
export const AddExpenseDialog = WithAddExpenseActions<DialogProps>(AddOperationDialog);
