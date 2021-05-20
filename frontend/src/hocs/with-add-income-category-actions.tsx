import React from 'react';
import { addIncomeCategory } from '../services/api.service';
import { AddOperationCategoryProps } from '../interfaces/common.interface';
import { AddOperationCategoryRequest } from '../interfaces/operation.interface';

export function WithAddIncomeCategoryActions<P>(
  WrappedComponent: React.ComponentType<P & AddOperationCategoryProps>
) {

  const handleAddOperationCategory = async (request: AddOperationCategoryRequest) => {
    return await addIncomeCategory(request);
  }

  return (props: P) => {
    return <WrappedComponent
      {...props}
      addOperationCategory={handleAddOperationCategory}
    />;
  };
}