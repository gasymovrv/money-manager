import React from 'react';
import { Container, makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import ErrorNotification from '../notification/error.notification';
import SuccessNotification from '../notification/success.notification';
import Footer from '../footer/footer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '98vw',
      minWidth: 550
    }
  })
);

const PageContainer: React.FC<any> = ({children}) => {
  const classes = useStyles();
  const success = useSelector(({success}: any) => success);
  const error = useSelector(({error}: any) => error);

  return (
    <Container maxWidth={false} disableGutters={true} className={classes.container}>
      {children}
      {error && <ErrorNotification text={error}/>}
      {success && <SuccessNotification text={success}/>}
      <Footer/>
    </Container>
  )
}

export default PageContainer;