import React, { useState } from 'react';
import { Button, Grid, Link, Typography } from '@material-ui/core';
import FileUploader from '../components/file-uploader/file-uploader';
import { downloadTemplateXlsxFile } from '../services/api.service';
import ErrorNotification from '../components/notification/error.notification';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Header from '../components/header/header';
import PageContainer from '../components/page-container/page-container';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      color: theme.palette.primary.light,
      cursor: 'pointer'
    },
  }),
);

const WelcomePage: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [error, setError] = useState<boolean>(false);

  const handleDownloadTemplate = async () => {
    setError(false);
    try {
      await downloadTemplateXlsxFile();
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  console.log('Welcome Page rendering');
  return (
    <PageContainer>
      <Header isWelcome={true}/>
      <Grid container alignItems="center" direction="column" spacing={4}>
        <Grid item><Typography variant="h2">Get started</Typography></Grid>
        <Grid item>
          <Typography variant="h6">
            You can start by importing a .xlsx file filled in as <Link className={classes.link}
                                                                       onClick={handleDownloadTemplate}>
            template.xlsx
          </Link>:
          </Typography>
        </Grid>
        <Grid item>
          <FileUploader onSend={() => window.location.assign('/')}/>
        </Grid>
        <Grid item>
          <Typography variant="h6">
            Or start from scratch:
          </Typography>
        </Grid>
        <Grid item>
          <Button onClick={() => history.push('/')}>
            <Typography variant="h5">
              Start
            </Typography>
          </Button>
        </Grid>
      </Grid>
      {error && <ErrorNotification text="Something went wrong"/>}
    </PageContainer>
  );
}

export default WelcomePage;
