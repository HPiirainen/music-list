import React from 'react';
import PropTypes from 'prop-types';
import { Alert, AlertTitle, Snackbar, useTheme } from '@mui/material';

const Message = (props) => {
  const { message, onClear, duration } = props;
  const theme = useTheme();

  const onClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClear();
  };

  if ('message' in message) {
    let content = message.message;
    if (Array.isArray(content)) {
      console.log(content);
      content = content.map((msg, index) => <li key={index}>{msg}</li>);
      content = (
        <ul sx={{ padding: theme.spacing(0, 0, 0, 2), margin: 0 }}>
          {content}
        </ul>
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

Message.propTypes = {
  message: PropTypes.object.isRequired,
  onClear: PropTypes.func,
  duration: PropTypes.number,
};

Message.defaultProps = {
  duration: 10000,
};

export default Message;
