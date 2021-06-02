import React from 'react';
import { Grid, Link, Typography } from '@material-ui/core';
import PageContainer from '../components/page-container/page-container';

const LoginPage: React.FC = () => (
  <PageContainer>
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{minHeight: '100vh'}}
    >
      <Grid item xs={5}>
        <Typography variant="h6">
          You can login with:
        </Typography>
        <Link color="inherit" href="oauth2/authorization/google">Google</Link>
      </Grid>
    </Grid>
  </PageContainer>
);

export default LoginPage;
