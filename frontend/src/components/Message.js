import React from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const Message = props => {
    const { message, onClear, duration } = props;
    if ('message' in message) {
        let content = message.message;
        if (Array.isArray(content)) {
            content = content.map(msg => <>{msg}<br/></>);
        }
        return (
            <Snackbar
                open={true}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                autoHideDuration={duration}
                onClose={onClear}
            >
                <Alert severity={message.type} variant="filled">{content}</Alert>
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