import React from 'react';
import { deleteIncome, editIncome } from '../services/api.service';
import { EditOperationProps } from '../interfaces/common.interface';
import { AddOrEditOperationRequest, OperationType } from '../interfaces/operation.interface';
import { getHocDisplayName } from '../helpers/hoc.helper';
import { MainTableState } from '../interfaces/main-table.interface';
import { useSelector } from 'react-redux';

export function WithEditIncomeActions<P>(
  WrappedComponent: React.ComponentType<P & EditOperationProps>
) {

  const handleEditOperation = async (id: number, request: AddOrEditOperationRequest) => {
    await editIncome(id, request);
  }

  const handleDeleteOperation = async (id: number) => {
    await deleteIncome(id);
  }

  const ResultComponent = (props: P) => {
    const {incomeCategories}: MainTableState = useSelector(({mainTable}: any) => mainTable);

    return (
      <WrappedComponent
        {...props}
        operationType={OperationType.INCOME}
        categories={incomeCategories}
        deleteOperation={handleDeleteOperation}
        editOperation={handleEditOperation}
      />
    );
  };
  ResultComponent.displayName = getHocDisplayName('WithEditIncomeActions', WrappedComponent);
  return ResultComponent;
}