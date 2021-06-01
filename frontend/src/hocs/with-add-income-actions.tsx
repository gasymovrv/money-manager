import React from 'react';
import { addIncome, getIncomeCategories } from '../services/api.service';
import { AddOperationProps } from '../interfaces/common.interface';
import { AddOrEditOperationRequest, OperationCategory } from '../interfaces/operation.interface';
import { getHocDisplayName } from '../helpers/hoc.helper';

export function WithAddIncomeActions<P>(
  WrappedComponent: React.ComponentType<P & AddOperationProps>
) {

  const handleGetCategories = async (): Promise<OperationCategory[]> => {
    return await getIncomeCategories();
  }

  const handleAddOperation = async (request: AddOrEditOperationRequest) => {
    await addIncome(request);
  }

  const ResultComponent = (props: P) => {
    return <WrappedComponent
      {...props}
      getCategories={handleGetCategories}
      addOperation={handleAddOperation}
    />;
  };
  ResultComponent.displayName = getHocDisplayName('WithAddIncomeActions', WrappedComponent);
  return ResultComponent;
}