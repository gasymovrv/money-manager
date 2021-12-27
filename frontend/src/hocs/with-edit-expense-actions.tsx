import React from 'react';
import { deleteExpense, editExpense } from '../services/api.service';
import { EditOperationProps } from '../interfaces/common.interface';
import { AddOrEditOperationRequest } from '../interfaces/operation.interface';
import { getHocDisplayName } from '../helpers/hoc.helper';
import { MainTableState } from '../interfaces/main-table.interface';
import { useSelector } from 'react-redux';

export function WithEditExpenseActions<P>(
  WrappedComponent: React.ComponentType<P & EditOperationProps>
) {

  const handleEditOperation = async (id: number, request: AddOrEditOperationRequest) => {
    await editExpense(id, request);
  }

  const handleDeleteOperation = async (id: number) => {
    await deleteExpense(id);
  }

  const ResultComponent = (props: P) => {
    const {expenseCategories}: MainTableState = useSelector(({mainTable}: any) => mainTable);

    return (
      <WrappedComponent
        {...props}
        categories={expenseCategories}
        deleteOperation={handleDeleteOperation}
        editOperation={handleEditOperation}
      />
    );
  };
  ResultComponent.displayName = getHocDisplayName('WithEditExpenseActions', WrappedComponent);
  return ResultComponent;
}