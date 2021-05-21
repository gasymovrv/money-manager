import React from 'react';
import { addIncomeCategory } from '../services/api.service';
import { AddOperationCategoryProps } from '../interfaces/common.interface';
import { AddOrEditOperationCategoryRequest } from '../interfaces/operation.interface';

export function WithAddIncomeCategoryActions<P>(
  WrappedComponent: React.ComponentType<P & AddOperationCategoryProps>
) {

  const handleAddOperationCategory = async (request: AddOrEditOperationCategoryRequest) => {
    return await addIncomeCategory(request);
  }

  return (props: P) => {
    return <WrappedComponent
      {...props}
      addOperationCategory={handleAddOperationCategory}
    />;
  };
}