import React from 'react';
import { Container, makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import ErrorNotification from '../notification/error.notification';
import SuccessNotification from '../notification/success.notification';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      minWidth: 700
    }
  })
);

const PageContainer: React.FC<any> = ({children}) => {
  const classes = useStyles();
  const success = useSelector(({success}: any) => success);
  const error = useSelector(({error}: any) => error);

  return (
    <Container maxWidth="xl" className={classes.container}>
      {children}
      {error && <ErrorNotification text={error}/>}
      {success && <SuccessNotification text={success}/>}
    </Container>
  )
}

export default PageContainer;