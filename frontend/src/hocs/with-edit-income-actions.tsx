import React from 'react';
import { deleteIncome, editIncome } from '../services/api.service';
import { EditOperationProps } from '../interfaces/common.interface';
import { AddOrEditOperationRequest } from '../interfaces/operation.interface';

export function WithEditIncomeActions<P>(
  WrappedComponent: React.ComponentType<P & EditOperationProps>
) {

  const handleEditOperation = async (id: number, request: AddOrEditOperationRequest) => {
    await editIncome(id, request);
  }

  const handleDeleteOperation = async (id: number) => {
    await deleteIncome(id);
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