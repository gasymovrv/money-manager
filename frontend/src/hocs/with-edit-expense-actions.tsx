import React from 'react';
import { deleteExpense, editExpense } from '../services/api.service';
import { EditOperationProps } from '../interfaces/common.interface';
import { AddOrEditOperationRequest } from '../interfaces/operation.interface';

export function WithEditExpenseActions<P>(
  WrappedComponent: React.ComponentType<P & EditOperationProps>
) {

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
        deleteOperation={handleDeleteOperation}
        editOperation={handleEditOperation}
      />
    );
  };
}