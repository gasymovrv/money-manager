import React from 'react';
import { addIncomeCategory } from '../services/api.service';
import { AddOperationCategoryProps } from '../interfaces/common.interface';
import { AddOrEditOperationCategoryRequest } from '../interfaces/operation.interface';
import { getHocDisplayName } from '../helpers/hoc.helper';

export function WithAddIncomeCategoryActions<P>(
  WrappedComponent: React.ComponentType<P & AddOperationCategoryProps>
) {

  const handleAddOperationCategory = async (request: AddOrEditOperationCategoryRequest) => {
    return await addIncomeCategory(request);
  }

  const ResultComponent = (props: P) => {
    return <WrappedComponent
      {...props}
      addOperationCategory={handleAddOperationCategory}
    />;
  };
  ResultComponent.displayName = getHocDisplayName('WithAddIncomeCategoryActions', WrappedComponent);
  return ResultComponent;
}