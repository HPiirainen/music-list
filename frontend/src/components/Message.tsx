import React, { ReactNode, SyntheticEvent } from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Snackbar,
  SnackbarCloseReason,
  useTheme,
} from '@mui/material';
import { TMessage } from '../types/types';

interface MessageProps {
  message: TMessage;
  onClear: () => void;
  duration?: number;
}

const Message: React.FC<MessageProps> = ({ message, onClear, duration }) => {
  const theme = useTheme();

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

  if ('message' in message) {
    const msgContent: string | string[] | undefined = message.message;
    let content: ReactNode = null;
    if (typeof msgContent === 'object') {
      const nodes = msgContent.map<ReactNode>((msg, index) => (
        <li key={index}>{msg}</li>
      ));
      content = (
        <Box
          component="ul"
          sx={{ padding: theme.spacing(0, 0, 0, 2), margin: 0 }}
        >
          {nodes}
        </Box>
      );
    }
    return (
      <Snackbar
        open={true}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        autoHideDuration={duration}
        onClose={onClose}
      >
        <Alert severity={message.type} variant="filled" sx={{ minWidth: 350 }}>
          <AlertTitle sx={{ textTransform: 'capitalize' }}>
            {message.type}
          </AlertTitle>
          {content}
        </Alert>
      </Snackbar>
    );
  }
  return null;
};

Message.defaultProps = {
  duration: 10000,
};

export default Message;
