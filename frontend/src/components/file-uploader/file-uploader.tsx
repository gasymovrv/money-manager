import React, { useState } from 'react';
import { Backdrop, Button, CircularProgress, Grid, Input, Typography } from '@material-ui/core';
import { importFromXlsxFile } from '../../services/api.service';
import { showSuccess } from '../../actions/success.actions';
import { showError } from '../../actions/error.actions';
import { useDispatch } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

type FileUploaderProps = {
  onSuccess(): void
}

const FileUploader: React.FC<FileUploaderProps> = ({onSuccess}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [importStarted, setImportStarted] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState();

  const onInputChange = ({target}: any) => {
    setSelectedFile(target.files[0]);
  };

  const handleSendFile = async () => {
    try {
      setImportStarted(true);
      await importFromXlsxFile(selectedFile);
      setImportStarted(false);
      dispatch(showSuccess('Excel file has been successfully imported'));
      onSuccess();
    } catch (error) {
      setImportStarted(false);
      console.log(error);
      dispatch(showError('Error occurred while importing file'));
    }
  };

  return (
    <Grid container alignItems="center" direction="column" spacing={2}>
      <Grid item>
        <Input
          id="import-button"
          inputProps={{
            accept:
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
          }}
          onChange={onInputChange}
          type="file"
        />
      </Grid>
      <Grid item>
        <Button disabled={!selectedFile || importStarted} onClick={handleSendFile}>
          <Typography variant="h5">
            Send
          </Typography>
        </Button>
      </Grid>
      <Backdrop className={classes.backdrop} open={importStarted}>
        <CircularProgress color="inherit"/>
      </Backdrop>
    </Grid>
  );
}

export default FileUploader