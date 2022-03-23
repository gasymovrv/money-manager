import { Box, DialogTitle, IconButton } from '@material-ui/core';
import React from 'react';
import CloseIcon from '@material-ui/icons/Close';

type CommonTitleDialogProps = {
  title: string,

  handleClose(): void
}

const CommonTitleDialog: React.FC<CommonTitleDialogProps> = ({title, handleClose}) => {
  return (
    <DialogTitle>
      <Box display="flex" alignItems="center">
        <Box flexGrow={1}>{title}</Box>
        <Box>
          <IconButton onClick={handleClose}>
            <CloseIcon/>
          </IconButton>
        </Box>
      </Box>
    </DialogTitle>
  );
}
export default CommonTitleDialog;