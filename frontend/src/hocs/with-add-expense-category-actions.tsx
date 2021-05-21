import React from 'react';
import { addExpenseCategory } from '../services/api.service';
import { AddOperationCategoryProps } from '../interfaces/common.interface';
import { AddOrEditOperationCategoryRequest } from '../interfaces/operation.interface';

export function WithAddExpenseCategoryActions<P>(
  WrappedComponent: React.ComponentType<P & AddOperationCategoryProps>
) {

  const handleAddOperationCategory = async (request: AddOrEditOperationCategoryRequest) => {
    return await addExpenseCategory(request);
  }

  return (props: P) => {
    return <WrappedComponent
      {...props}
      addOperationCategory={handleAddOperationCategory}
    />;
  };
}