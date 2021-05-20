import React from 'react';
import { addExpense, getExpenseCategories } from '../services/api.service';
import { AddOperationProps } from '../interfaces/common.interface';
import { AddOrEditOperationRequest, OperationCategory } from '../interfaces/operation.interface';

export function WithAddExpenseActions<P>(
  WrappedComponent: React.ComponentType<P & AddOperationProps>
) {

  const handleGetCategories = async (): Promise<OperationCategory[]> => {
    return await getExpenseCategories();
  }

  const handleAddOperation = async (request: AddOrEditOperationRequest) => {
    await addExpense(request);
  }

  return (props: P) => {
    return <WrappedComponent
      {...props}
      getCategories={handleGetCategories}
      addOperation={handleAddOperation}
    />;
  };
}