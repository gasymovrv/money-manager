import React, { useState } from 'react';
import { Button, Grid, Link, Typography } from '@material-ui/core';
import FileUploader from '../file-uploader/file-uploader';
import { downloadTemplateXlsxFile } from '../../services/api.service';
import ErrorNotification from '../notification/error.notification';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      color: theme.palette.primary.light,
      cursor: 'pointer'
    },
  }),
);

const WelcomeBox: React.FC<{ onStart(): void }> = ({onStart}) => {
  const classes = useStyles();
  const [error, setError] = useState<boolean>(false);
  console.log('Welcome Box rendering')

  const handleDownloadTemplate = async () => {
    setError(false);
    try {
      await downloadTemplateXlsxFile();
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  const handleImportXlsx = async () => {
    window.location.assign('/');
  };

  return (
    <>
      <Grid container alignItems="center" direction="column" spacing={4}>
        <Grid item><Typography variant="h2">Get started</Typography></Grid>
        <Grid item>
          <Typography variant="h6">
            You can start by uploading a .xlsx file filled in as <Link className={classes.link}
                                                                       onClick={handleDownloadTemplate}>
            template.xlsx
          </Link>:
          </Typography>
        </Grid>
        <Grid item>
          <FileUploader onSend={handleImportXlsx}/>
        </Grid>
        <Grid item>
          <Typography variant="h6">
            Or start from scratch:
          </Typography>
        </Grid>
        <Grid item>
          <Button onClick={onStart}>
            <Typography variant="h5">
              Start
            </Typography>
          </Button>
        </Grid>
      </Grid>
      {error && <ErrorNotification text="Something went wrong"/>}
    </>
  );
}

export default WelcomeBox;
