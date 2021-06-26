import React from 'react';
import { Grid, Link, Typography } from '@material-ui/core';
import PageContainer from '../components/page-container/page-container';

const LoginPage: React.FC = () => (
  <PageContainer>
    <Grid
      container
      spacing={3}
      direction="column"
      alignItems="center"
      justify="center"
      style={{minHeight: '90vh'}}
    >
      <Grid item>
        <Typography variant="h4">
          You can log in with:
        </Typography>
      </Grid>
      <Grid item>
        <Link color="inherit" href="oauth2/authorization/google">
          <Typography variant="h4">Google</Typography>
        </Link>
      </Grid>
    </Grid>
  </PageContainer>
);

export default LoginPage;
