import React from 'react';
import { Container, makeStyles } from '@material-ui/core';
import { createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      minWidth: 700
    }
  })
);

const PageContainer: React.FC<any> = ({children}) => {
  const classes = useStyles();

  return (
    <Container maxWidth="xl" className={classes.container}>
      {children}
    </Container>
  )
}

export default PageContainer;