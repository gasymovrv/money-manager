import React from 'react';
import { deleteIncomeCategory, editIncomeCategory } from '../services/api.service';
import { EditOperationCategoryProps } from '../interfaces/common.interface';
import { AddOrEditOperationCategoryRequest } from '../interfaces/operation.interface';
import { getHocDisplayName } from '../helpers/hoc.helper';

export function WithEditIncomeCategoryActions<P>(
  WrappedComponent: React.ComponentType<P & EditOperationCategoryProps>
) {

  const handleEditOperationCategory = async (id: number, request: AddOrEditOperationCategoryRequest) => {
    return await editIncomeCategory(id, request);
  }

  const handleDeleteOperationCategory = async (id: number) => {
    await deleteIncomeCategory(id);
  }

  const ResultComponent = (props: P) => {
    return <WrappedComponent
      {...props}
      editOperationCategory={handleEditOperationCategory}
      deleteOperationCategory={handleDeleteOperationCategory}
    />;
  };
  ResultComponent.displayName = getHocDisplayName('WithEditIncomeCategoryActions', WrappedComponent);
  return ResultComponent;
}