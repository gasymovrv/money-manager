import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { hideSuccess } from '../../actions/success.actions';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SuccessNotification: React.FC<{ text: string }> = ({text}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(true);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleOnExited = () => {
    dispatch(hideSuccess());
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar open={open} onExited={handleOnExited} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} variant="standard" severity="success">
          {text}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SuccessNotification