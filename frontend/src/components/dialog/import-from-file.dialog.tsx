import { Dialog, DialogContent, DialogContentText, Link } from '@material-ui/core';
import React from 'react';
import { DialogProps } from '../../interfaces/common.interface';
import { downloadTemplateXlsxFile } from '../../services/api.service';
import { useDispatch } from 'react-redux';
import { showError } from '../../actions/error.actions';
import { COMMON_ERROR_MSG } from '../../constants';
import CommonTitleDialog from './common-title.dialog';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FileUploader from '../file-uploader/file-uploader';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    link: {
      color: theme.palette.primary.light,
      cursor: 'pointer'
    }
  }),
);

const ImportFromFileDialog: React.FC<DialogProps> = ({
                                                       open,
                                                       handleClose
                                                     }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplateXlsxFile();
    } catch (error) {
      console.log(error);
      dispatch(showError(COMMON_ERROR_MSG));
    }
  };

  return (
    <Dialog maxWidth="xs" open={open} onClose={handleClose}>

      <CommonTitleDialog title="Import from Excel file" handleClose={handleClose}/>

      <DialogContent>
        <DialogContentText>
          Import a .xlsx file filled in as <Link className={classes.link}
                                                 onClick={handleDownloadTemplate}>
          template.xlsx
        </Link>
        </DialogContentText>
        <FileUploader onSuccess={() => window.location.assign('/')}/>
      </DialogContent>
    </Dialog>
  );
}

export default ImportFromFileDialog;
