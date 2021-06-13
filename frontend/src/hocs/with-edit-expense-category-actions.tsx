import React from 'react';
import { deleteExpenseCategory, editExpenseCategory } from '../services/api.service';
import { EditOperationCategoryProps } from '../interfaces/common.interface';
import { AddOrEditOperationCategoryRequest } from '../interfaces/operation.interface';
import { getHocDisplayName } from '../helpers/hoc.helper';

export function WithEditExpenseCategoryActions<P>(
  WrappedComponent: React.ComponentType<P & EditOperationCategoryProps>
) {

  const handleEditOperationCategory = async (id: number, request: AddOrEditOperationCategoryRequest) => {
    return await editExpenseCategory(id, request);
  }

  const handleDeleteOperationCategory = async (id: number) => {
    await deleteExpenseCategory(id);
  }

  const ResultComponent = (props: P) => {
    return <WrappedComponent
      {...props}
      editOperationCategory={handleEditOperationCategory}
      deleteOperationCategory={handleDeleteOperationCategory}
    />;
  };
  ResultComponent.displayName = getHocDisplayName('WithEditExpenseCategoryActions', WrappedComponent);
  return ResultComponent;
}