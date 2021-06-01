import React from 'react';
import { addExpenseCategory } from '../services/api.service';
import { AddOperationCategoryProps } from '../interfaces/common.interface';
import { AddOrEditOperationCategoryRequest } from '../interfaces/operation.interface';
import { getHocDisplayName } from '../helpers/hoc.helper';

export function WithAddExpenseCategoryActions<P>(
  WrappedComponent: React.ComponentType<P & AddOperationCategoryProps>
) {

  const handleAddOperationCategory = async (request: AddOrEditOperationCategoryRequest) => {
    return await addExpenseCategory(request);
  }

  const ResultComponent = (props: P) => {
    return <WrappedComponent
      {...props}
      addOperationCategory={handleAddOperationCategory}
    />;
  };
  ResultComponent.displayName = getHocDisplayName('WithAddExpenseCategoryActions', WrappedComponent);
  return ResultComponent;
}