import React from 'react';
import { Button, Grid, Input, Typography } from '@material-ui/core';
import { importFromXlsxFile } from '../../services/api.service';
import { showSuccess } from '../../actions/success.actions';
import { showError } from '../../actions/error.actions';
import { useDispatch } from 'react-redux';

type FileUploaderProps = {
  onSend(): void
}

const FileUploader: React.FC<FileUploaderProps> = ({onSend}) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = React.useState();

  const onInputChange = ({target}: any) => {
    setSelectedFile(target.files[0]);
  };

  const handleSendFile = async () => {
    try {
      await importFromXlsxFile(selectedFile);
      dispatch(showSuccess('Excel file has been successfully imported'));
      onSend();
    } catch (error) {
      console.log(error);
      dispatch(showError('Error occurred while importing file'));
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
    </>
  );
}

export default FileUploader