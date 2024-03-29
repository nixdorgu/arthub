import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default function SimpleSnackbar(props) {
  const {message, undo, snackbarRef, error, showSnackbar, setShowSnackbar} = props.props;
  const [open, setOpen] = [showSnackbar, setShowSnackbar];

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        ref={snackbarRef}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={
          <>
           {
            !error ? <Button color="secondary" size="small" onClick={() => {
              undo();
              handleClose();
            }}>
              UNDO
            </Button> : null
            }
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
  );
}
