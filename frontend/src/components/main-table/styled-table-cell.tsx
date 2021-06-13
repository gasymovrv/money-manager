import { TableCell, withStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      borderBottom: 0,
      backgroundColor: theme.palette.primary.dark,
      fontSize: 14
    },
    root: {
      borderRightWidth: 2,
      borderRightColor: grey['600'],
      borderRightStyle: 'solid',
      textAlign: 'center',
      padding: 0,
      fontSize: 13,
    },
  }),
)(TableCell);

export default StyledTableCell;