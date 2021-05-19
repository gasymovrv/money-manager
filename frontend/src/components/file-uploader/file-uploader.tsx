import React, { useState } from 'react';
import { Button, Grid, Input, Typography } from '@material-ui/core';
import { importFromXlsxFile } from '../../services/api.service';
import ErrorNotification from '../notification/error.notification';
import SuccessNotification from '../notification/success.notification';

type FileUploaderProps = {
  onSend(): void
}

const FileUploader: React.FC<FileUploaderProps> = ({onSend}) => {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = React.useState();

  const onInputChange = ({target}: any) => {
    setSelectedFile(target.files[0]);
  };

  const handleSendFile = async () => {
    setSuccess(false);
    setError(false);
    try {
      await importFromXlsxFile(selectedFile);
      setSuccess(true);
      onSend();
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  return (
    <>
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
          <Button disabled={!selectedFile} onClick={handleSendFile}>
            <Typography variant="h5">
              Send
            </Typography>
          </Button>
        </Grid>
      </Grid>
      {success && <SuccessNotification text="Excel file has been successfully imported"/>}
      {error && <ErrorNotification text="Invalid template file"/>}
    </>
  );
}

export default FileUploader