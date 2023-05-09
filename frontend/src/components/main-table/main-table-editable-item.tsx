import React from 'react';
import { Operation, OperationCategory, OperationType } from '../../interfaces/operation.interface';
import { makeStyles, MenuItem, Tooltip } from '@material-ui/core';
import { createStyles } from '@material-ui/core/styles';
import { EditExpenseDialog, EditIncomeDialog } from '../dialog/edit-operation.dialog';
import MoneyFormat from '../money-format/money-format';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

type MainTableEditableItemProps = {
  colorClass: string | undefined,
  isCurrentPeriod: boolean,
  operation: Operation,
  operationType: OperationType,
  categories: OperationCategory[]
}

const useStyles = makeStyles((theme) =>
  createStyles({
    menuItem: {
      justifyContent: 'center',
      padding: 0,
      paddingRight: theme.spacing(0.5),
      paddingLeft: theme.spacing(0.5),
      fontSize: 13
    },
    secondaryColor: {
      color: theme.palette.secondary.main
    },
    paperColor: {
      color: theme.palette.background.paper
    },
    errorIcon: {
      color: theme.palette.error.main,
      marginLeft: theme.spacing(0.5),
    }
  })
);

const MainTableEditableItem: React.FC<MainTableEditableItemProps> = ({
                                                                       colorClass,
                                                                       isCurrentPeriod,
                                                                       operation,
                                                                       operationType
                                                                     }) => {
  const {id, value, isPlanned, description} = operation;
  const [openEditOperation, setOpenEditOperation] = React.useState(false);
  const [openDescriptionTooltip, setOpenDescriptionTooltip] = React.useState(false);
  const [openOverdueTooltip, setOpenOverdueTooltip] = React.useState(false);
  const classes = useStyles();

  const handleOpenEditOperation = () => {
    setOpenEditOperation(true);
  };

  const handleCloseEditOperation = () => {
    setOpenEditOperation(false);
  };

  let itemColor = colorClass;
  if (isPlanned && isCurrentPeriod) {
    itemColor = classes.paperColor;
  } else if (isPlanned) {
    itemColor = classes.secondaryColor;
  }
  const clickableMenu = (
    <Tooltip open={openDescriptionTooltip && !openOverdueTooltip}
             onOpen={() => {
               setOpenDescriptionTooltip(true)
             }}
             onClose={() => {
               setOpenDescriptionTooltip(false)
             }}
             title={description || ''}>
      <MenuItem
        key={id}
        className={`${classes.menuItem} ${itemColor}`}
        onClick={handleOpenEditOperation}
      >
        <MoneyFormat value={value}/>
        {operation.isOverdue &&
            <Tooltip title="This operation is overdue"
                     open={openOverdueTooltip}
                     onOpen={() => {
                       setOpenOverdueTooltip(true)
                     }}
                     onClose={() => {
                       setOpenOverdueTooltip(false)
                     }}>
                <ErrorOutlineIcon fontSize="small" className={classes.errorIcon}/>
            </Tooltip>
        }
      </MenuItem>
    </Tooltip>
  )

  switch (operationType) {
    case OperationType.INCOME:
      return (
        <>
          {clickableMenu}
          <EditIncomeDialog
            operation={operation}
            open={openEditOperation}
            handleClose={handleCloseEditOperation}
          />
        </>
      );
    case OperationType.EXPENSE:
      return (
        <>
          {clickableMenu}
          <EditExpenseDialog
            operation={operation}
            open={openEditOperation}
            handleClose={handleCloseEditOperation}
          />
        </>
      );
  }
}

export default MainTableEditableItem;
