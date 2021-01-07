import React from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';


export default function OngoingTransactionModal({transaction, show, handleClose, handleSubmit}) {
    const theme = createMuiTheme({
        typography: {
          fontFamily: [
            'Montserrat',
            'sans-serif',
          ].join(','),
        },
    });
      
  return (
    <ThemeProvider theme={theme}>
        <Dialog open={show} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle className="font" id="form-dialog-title">Submit Files via Link</DialogTitle>
        <DialogContent>
            <DialogContentText className="font">
                To send materials to {transaction.customer_name}, please enter your submission link here.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="body"
                label="Submission link"
                type="text"
                color="secondary"
                fullWidth
            />
        </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">Cancel</Button>
                <Button onClick={handleSubmit} color="secondary">Send</Button>
            </DialogActions>
        </Dialog>
    </ThemeProvider>
  );
}



