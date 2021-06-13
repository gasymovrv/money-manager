import React from 'react';
import { addIncome } from '../services/api.service';
import { AddOperationProps } from '../interfaces/common.interface';
import { AddOrEditOperationRequest } from '../interfaces/operation.interface';
import { getHocDisplayName } from '../helpers/hoc.helper';
import { MainTableState } from '../interfaces/main-table.interface';
import { useSelector } from 'react-redux';

export function WithAddIncomeActions<P>(
  WrappedComponent: React.ComponentType<P & AddOperationProps>
) {
  const handleAddOperation = async (request: AddOrEditOperationRequest) => {
    await addIncome(request);
  }

  const ResultComponent = (props: P) => {
    const {incomeCategories}: MainTableState = useSelector(({mainTable}: any) => mainTable);

    return <WrappedComponent
      {...props}
      categories={incomeCategories}
      addOperation={handleAddOperation}
    />;
  };
  ResultComponent.displayName = getHocDisplayName('WithAddIncomeActions', WrappedComponent);
  return ResultComponent;
}