import React, { PropsWithChildren, SyntheticEvent } from 'react';
import {
  Alert,
  AlertColor,
  AlertTitle,
  Snackbar,
  SnackbarCloseReason,
} from '@mui/material';

interface MessageProps {
  type: AlertColor | undefined;
  onClear: () => void;
  duration?: number;
}

const Message: React.FC<PropsWithChildren<MessageProps>> = ({
  type,
  onClear,
  duration,
  children,
}) => {
  const onClose = (
    // TODO: Fix unknown if possible.
    event: SyntheticEvent<unknown> | Event,
    reason: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    onClear();
  };

  return (
    <Snackbar
      open={true}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      autoHideDuration={duration}
      onClose={onClose}
    >
      <Alert severity={type} variant="filled" sx={{ minWidth: 350 }}>
        <AlertTitle sx={{ textTransform: 'capitalize' }}>{type}</AlertTitle>
        {children}
      </Alert>
    </Snackbar>
  );
};

Message.defaultProps = {
  type: 'success',
  duration: 10000,
};

export default Message;
