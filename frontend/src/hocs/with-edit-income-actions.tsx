import React from 'react';
import { deleteIncome, editIncome, getIncomeCategories } from '../services/api.service';
import { EditOperationProps } from '../interfaces/common.interface';
import { AddOrEditOperationRequest, OperationCategory } from '../interfaces/operation.interface';

export function WithEditIncomeActions<P>(
  WrappedComponent: React.ComponentType<P & EditOperationProps>
) {

  const handleGetCategories = async (): Promise<OperationCategory[]> => {
    return await getIncomeCategories();
  }

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
        getCategories={handleGetCategories}
        deleteOperation={handleDeleteOperation}
        editOperation={handleEditOperation}
      />
    );
  };
}