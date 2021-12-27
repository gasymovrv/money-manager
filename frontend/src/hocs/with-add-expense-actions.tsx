import React from 'react';
import { addExpense } from '../services/api.service';
import { AddOperationProps } from '../interfaces/common.interface';
import { AddOrEditOperationRequest } from '../interfaces/operation.interface';
import { getHocDisplayName } from '../helpers/hoc.helper';
import { MainTableState } from '../interfaces/main-table.interface';
import { useSelector } from 'react-redux';

export function WithAddExpenseActions<P>(
  WrappedComponent: React.ComponentType<P & AddOperationProps>
) {
  const handleAddOperation = async (request: AddOrEditOperationRequest) => {
    await addExpense(request);
  }

  const ResultComponent = (props: P) => {
    const {expenseCategories}: MainTableState = useSelector(({mainTable}: any) => mainTable);

    return <WrappedComponent
      {...props}
      categories={expenseCategories}
      addOperation={handleAddOperation}
    />;
  };
  ResultComponent.displayName = getHocDisplayName('WithAddExpenseActions', WrappedComponent);
  return ResultComponent;
}
