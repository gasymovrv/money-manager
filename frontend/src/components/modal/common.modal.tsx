import { Modal } from '@material-ui/core';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

type CommonModalProps = {
  open: boolean,
  title: string,
  text: string,
  handleClose(): void
}

const CommonModal: React.FC<CommonModalProps> = ({
                                                   open,
                                                   title,
                                                   text,
                                                   handleClose
                                                 }) => {
  const classes = useStyles();
  return (
    <Modal open={open} onClose={handleClose}>
      <div className={classes.paper}>
        <h2>{title}</h2>
        <p>
          {text}
        </p>
      </div>
    </Modal>
  )
}
export default CommonModal;