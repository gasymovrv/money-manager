import React from 'react';
import { deleteExpense, editExpense, getExpenseCategories } from '../services/api.service';
import { EditOperationProps } from '../interfaces/common.interface';
import { AddOrEditOperationRequest, OperationCategory } from '../interfaces/operation.interface';

export function WithEditExpenseActions<P>(
  WrappedComponent: React.ComponentType<P & EditOperationProps>
) {

  const handleGetCategories = async (): Promise<OperationCategory[]> => {
    return await getExpenseCategories();
  }

  const handleEditOperation = async (id: number, request: AddOrEditOperationRequest) => {
    await editExpense(id, request);
  }

  const handleDeleteOperation = async (id: number) => {
    await deleteExpense(id);
  }

  return (props: P) => {
    return (
      <WrappedComponent
        {...props}
        getCategories={handleGetCategories}
        deleteOperation={handleDeleteOperation}
        editOperation={handleEditOperation}
      />
    );
  };
}